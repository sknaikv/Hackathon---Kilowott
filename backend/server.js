const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const syncRoutes = require('./routes/sync');
const aiRoutes = require('./routes/ai');
const categoryRoutes = require('./routes/categories');
const woocommerceRoutes = require('./routes/woocommerce');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many AI requests, please try again later.'
});

app.use('/api/', generalLimiter);
app.use('/api/ai/', aiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/woocommerce', woocommerceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Storage: ${process.env.USE_MONGODB === 'true' ? 'MongoDB' : 'JSON File'}`);
});

module.exports = app;
