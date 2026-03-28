const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// POST /api/sync/product/:id - Sync single product
router.post('/product/:id', syncController.syncProduct);

// POST /api/sync/batch - Sync multiple products
router.post('/batch', syncController.syncBatch);

// POST /api/sync/all-pending - Sync all pending products
router.post('/all-pending', syncController.syncAllPending);

// GET /api/sync/status/:productId - Get sync status
router.get('/status/:productId', syncController.getSyncStatus);

// GET /api/sync/logs - Get sync logs
router.get('/logs', syncController.getSyncLogs);

module.exports = router;
