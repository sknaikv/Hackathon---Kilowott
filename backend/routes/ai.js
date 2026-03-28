const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/generate-description - Generate product description
router.post('/generate-description', aiController.generateDescription);

// POST /api/ai/extract-attributes - Extract attributes
router.post('/extract-attributes', aiController.extractAttributes);

// POST /api/ai/validate-product - Validate product
router.post('/validate-product', aiController.validateProduct);

// POST /api/ai/bulk-enhance - Bulk enhance products
router.post('/bulk-enhance', aiController.bulkEnhance);

module.exports = router;
