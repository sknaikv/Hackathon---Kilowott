const storage = require('../services/fileStorage');
const woocommerceService = require('../services/woocommerceService');

// Sync single product
exports.syncProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await storage.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    if (!woocommerceService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'WooCommerce not configured'
        }
      });
    }

    const startTime = Date.now();
    let wcProduct, action;

    try {
      if (product.woocommerceId) {
        // Update existing product
        wcProduct = await woocommerceService.updateProduct(product.woocommerceId, product);
        action = 'update';
      } else {
        // Create new product
        wcProduct = await woocommerceService.createProduct(product);
        action = 'create';
      }

      const duration = Date.now() - startTime;

      // Update product with sync status
      await storage.updateProduct(id, {
        woocommerceId: wcProduct.id,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString()
      });

      // Log sync
      await storage.addSyncLog({
        productId: id,
        productSku: product.sku,
        action,
        status: 'success',
        woocommerceId: wcProduct.id,
        request: woocommerceService.transformProduct(product),
        response: wcProduct,
        duration
      });

      res.json({
        success: true,
        data: {
          productId: id,
          woocommerceId: wcProduct.id,
          action,
          syncStatus: 'synced'
        },
        message: `Product ${action === 'create' ? 'created' : 'updated'} in WooCommerce`
      });
    } catch (error) {
      // Update product with failed status
      await storage.updateProduct(id, {
        syncStatus: 'failed'
      });

      // Log failed sync
      await storage.addSyncLog({
        productId: id,
        productSku: product.sku,
        action: product.woocommerceId ? 'update' : 'create',
        status: 'failed',
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        },
        duration: Date.now() - startTime
      });

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Sync multiple products
exports.syncBatch = async (req, res, next) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'productIds must be a non-empty array'
        }
      });
    }

    if (!woocommerceService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'WooCommerce not configured'
        }
      });
    }

    const results = [];
    let successful = 0;
    let failed = 0;

    // Process products sequentially to avoid rate limiting
    for (const id of productIds) {
      const product = await storage.getProductById(id);
      
      if (!product) {
        results.push({
          productId: id,
          status: 'failed',
          error: 'Product not found'
        });
        failed++;
        continue;
      }

      try {
        const startTime = Date.now();
        let wcProduct, action;

        if (product.woocommerceId) {
          wcProduct = await woocommerceService.updateProduct(product.woocommerceId, product);
          action = 'update';
        } else {
          wcProduct = await woocommerceService.createProduct(product);
          action = 'create';
        }

        const duration = Date.now() - startTime;

        await storage.updateProduct(id, {
          woocommerceId: wcProduct.id,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        });

        await storage.addSyncLog({
          productId: id,
          productSku: product.sku,
          action,
          status: 'success',
          woocommerceId: wcProduct.id,
          duration
        });

        results.push({
          productId: id,
          status: 'success',
          woocommerceId: wcProduct.id,
          action
        });
        successful++;
      } catch (error) {
        await storage.updateProduct(id, {
          syncStatus: 'failed'
        });

        await storage.addSyncLog({
          productId: id,
          productSku: product.sku,
          action: product.woocommerceId ? 'update' : 'create',
          status: 'failed',
          error: {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
          }
        });

        results.push({
          productId: id,
          status: 'failed',
          error: error.message
        });
        failed++;
      }
    }

    res.json({
      success: true,
      data: {
        successful,
        failed,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};

// Sync all pending products
exports.syncAllPending = async (req, res, next) => {
  try {
    if (!woocommerceService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'WooCommerce not configured'
        }
      });
    }

    const startTime = Date.now();
    const pendingProducts = await storage.getProducts({ syncStatus: 'pending' });

    if (pendingProducts.length === 0) {
      return res.json({
        success: true,
        data: {
          total: 0,
          successful: 0,
          failed: 0,
          duration: 0
        },
        message: 'No pending products to sync'
      });
    }

    let successful = 0;
    let failed = 0;

    for (const product of pendingProducts) {
      try {
        let wcProduct, action;

        if (product.woocommerceId) {
          wcProduct = await woocommerceService.updateProduct(product.woocommerceId, product);
          action = 'update';
        } else {
          wcProduct = await woocommerceService.createProduct(product);
          action = 'create';
        }

        await storage.updateProduct(product.id, {
          woocommerceId: wcProduct.id,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        });

        await storage.addSyncLog({
          productId: product.id,
          productSku: product.sku,
          action,
          status: 'success',
          woocommerceId: wcProduct.id
        });

        successful++;
      } catch (error) {
        await storage.updateProduct(product.id, {
          syncStatus: 'failed'
        });

        await storage.addSyncLog({
          productId: product.id,
          productSku: product.sku,
          action: product.woocommerceId ? 'update' : 'create',
          status: 'failed',
          error: {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
          }
        });

        failed++;
      }
    }

    const duration = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        total: pendingProducts.length,
        successful,
        failed,
        duration
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get sync status for a product
exports.getSyncStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await storage.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    const logs = await storage.getSyncLogs({ productId });

    res.json({
      success: true,
      data: {
        currentStatus: product.syncStatus,
        woocommerceId: product.woocommerceId,
        lastSyncedAt: product.lastSyncedAt,
        history: logs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all sync logs
exports.getSyncLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, productId, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;

    let logs = await storage.getSyncLogs(filter);

    // Date filtering
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        if (startDate && logDate < new Date(startDate)) return false;
        if (endDate && logDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: logs.length,
          pages: Math.ceil(logs.length / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
