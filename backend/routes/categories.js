const express = require('express');
const router = express.Router();
const storage = require('../services/fileStorage');
const woocommerceService = require('../services/woocommerceService');

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await storage.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories/sync - Sync categories from WooCommerce
router.post('/sync', async (req, res, next) => {
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

    const wcCategories = await woocommerceService.getCategories();
    
    const categories = wcCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      woocommerceId: cat.id,
      slug: cat.slug,
      parentId: cat.parent
    }));

    await storage.saveCategories(categories);

    res.json({
      success: true,
      data: {
        synced: categories.length,
        message: 'Categories synced successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
