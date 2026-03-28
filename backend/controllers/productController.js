const storage = require('../services/fileStorage');
const woocommerceService = require('../services/woocommerceService');

// Get all products
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, syncStatus, category, search } = req.query;

    const filter = {};
    if (syncStatus) filter.syncStatus = syncStatus;
    if (category) filter.category = category;
    if (search) filter.search = search;

    let products = await storage.getProducts(filter);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          pages: Math.ceil(products.length / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await storage.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create product
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    // Basic validation
    if (!productData.name || !productData.price || !productData.sku) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: [
            { field: 'name', message: 'Product name is required' },
            { field: 'price', message: 'Price is required' },
            { field: 'sku', message: 'SKU is required' }
          ].filter(d => !productData[d.field])
        }
      });
    }

    // Validate price
    if (typeof productData.price !== 'number' || productData.price < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid price',
          details: [{ field: 'price', message: 'Price must be a positive number' }]
        }
      });
    }

    // Check for duplicate SKU
    const existing = await storage.getProductBySku(productData.sku);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product with this SKU already exists',
          details: [{ field: 'sku', message: 'SKU must be unique' }]
        }
      });
    }

    const product = await storage.createProduct(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const existing = await storage.getProductById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    // Validate price if provided
    if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price < 0)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid price',
          details: [{ field: 'price', message: 'Price must be a positive number' }]
        }
      });
    }

    // Check SKU uniqueness if being updated
    if (updates.sku && updates.sku !== existing.sku) {
      const duplicate = await storage.getProductBySku(updates.sku);
      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Product with this SKU already exists',
            details: [{ field: 'sku', message: 'SKU must be unique' }]
          }
        });
      }
    }

    const product = await storage.updateProduct(id, updates);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
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

    // If product is synced to WooCommerce, delete from there too
    if (product.woocommerceId && woocommerceService.isConfigured()) {
      try {
        await woocommerceService.deleteProduct(product.woocommerceId);
      } catch (error) {
        console.error('Failed to delete from WooCommerce:', error.message);
        // Continue with local deletion
      }
    }

    await storage.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get product statistics
exports.getStats = async (req, res, next) => {
  try {
    const stats = await storage.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
