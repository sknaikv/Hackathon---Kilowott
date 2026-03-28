const aiService = require('../services/aiService');

// Generate product description
exports.generateDescription = async (req, res, next) => {
  try {
    const { productName, category, attributes, tone } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'productName is required'
        }
      });
    }

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'AI service not configured. Please add OPENAI_API_KEY to .env'
        }
      });
    }

    const result = await aiService.generateDescription({
      productName,
      category,
      attributes,
      tone
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Extract attributes from product title
exports.extractAttributes = async (req, res, next) => {
  try {
    const { productTitle } = req.body;

    if (!productTitle) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'productTitle is required'
        }
      });
    }

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'AI service not configured. Please add OPENAI_API_KEY to .env'
        }
      });
    }

    const result = await aiService.extractAttributes(productTitle);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Validate product data
exports.validateProduct = async (req, res, next) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'product data is required'
        }
      });
    }

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'AI service not configured. Please add OPENAI_API_KEY to .env'
        }
      });
    }

    const result = await aiService.validateProduct(product);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Bulk enhance products
exports.bulkEnhance = async (req, res, next) => {
  try {
    const { productIds, enhancements } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'productIds must be a non-empty array'
        }
      });
    }

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'AI service not configured. Please add OPENAI_API_KEY to .env'
        }
      });
    }

    const storage = require('../services/fileStorage');
    const products = await Promise.all(
      productIds.map(id => storage.getProductById(id))
    );

    const validProducts = products.filter(p => p !== null);

    if (validProducts.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No valid products found'
        }
      });
    }

    const results = await aiService.bulkEnhance(validProducts, enhancements);

    // Update products with enhancements
    for (const result of results) {
      if (result.success && Object.keys(result.enhancements).length > 0) {
        await storage.updateProduct(result.productId, {
          ...result.enhancements,
          aiGenerated: {
            description: result.enhancements.description !== undefined,
            attributes: result.enhancements.attributes !== undefined
          }
        });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });
  } catch (error) {
    next(error);
  }
};
