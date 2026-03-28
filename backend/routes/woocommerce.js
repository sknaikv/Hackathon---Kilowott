const express = require('express');
const router = express.Router();
const woocommerceService = require('../services/woocommerceService');

// GET /api/woocommerce/test - Test connection
router.get('/test', async (req, res, next) => {
  try {
    const result = await woocommerceService.testConnection();
    
    if (result.connected) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(503).json({
        success: false,
        error: {
          code: 'CONNECTION_FAILED',
          message: result.error
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
