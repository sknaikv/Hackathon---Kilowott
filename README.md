# Product Information Management (PIM) System

A modern PIM system with WooCommerce integration and AI-powered product management.

## 🌟 Features

- **Product Management**: Create, update, delete products with dynamic attributes
- **AI Integration**: 
  - Generate product descriptions with GPT
  - Extract attributes from product titles
  - Validate product data quality
- **WooCommerce Sync**: Seamless two-way sync with WooCommerce stores
- **Sync Dashboard**: Track sync status and view detailed logs
- **Dynamic Attributes**: Flexible schema for any product type

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- WooCommerce store with REST API enabled
- OpenAI API key

### Installation

1. **Clone and Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

2. **Setup Frontend**
```bash
npm install
cp .env.example .env
npm run dev
```

3. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DESIGN.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

## 🎯 Key Features

### AI-Powered Product Creation
- Generate SEO-optimized descriptions
- Extract attributes automatically
- Validate data before sync

### WooCommerce Integration
- One-click sync to WooCommerce
- Batch sync operations
- Detailed sync logs

### Flexible Architecture
- JSON file storage (fast setup)
- MongoDB ready (production)
- Extensible to other platforms

## 🛠️ Tech Stack

**Frontend**: React, Vite  
**Backend**: Node.js, Express  
**Storage**: JSON files (configurable to MongoDB)  
**AI**: OpenAI GPT-3.5/4  
**Integration**: WooCommerce REST API  

## 📖 Usage

1. **Create a Product**
   - Navigate to "Create Product"
   - Enter product details
   - Use AI to generate description and extract attributes
   - Save product

2. **Sync to WooCommerce**
   - View products in list
   - Click sync button on individual product
   - Or use Sync Dashboard for batch operations

3. **Monitor Sync Status**
   - Check Sync Dashboard for statistics
   - View detailed sync logs
   - Track success/failure rates

## 🎨 Screenshots

*Note: Add screenshots here after demo*

## 🔒 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
USE_MONGODB=false
WC_STORE_URL=https://yourstore.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx
OPENAI_API_KEY=sk-xxx
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

This is a hackathon project. For production use, consider:
- Add authentication
- Implement MongoDB
- Add comprehensive tests
- Set up CI/CD pipeline

## 📄 License

MIT

## 👥 Authors

Built for hackathon 2026

---

**Made with ❤️ and AI ✨**
