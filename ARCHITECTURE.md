# 🏗️ PIM System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────┬──────────────────┬────────────────────────────┤
│ Product Manager │  Sync Dashboard  │  AI Assistant Panel        │
└────────┬────────┴────────┬─────────┴────────┬───────────────────┘
         │                 │                   │
         └─────────────────┼───────────────────┘
                           │ REST API
         ┌─────────────────▼───────────────────┐
         │      EXPRESS.JS BACKEND              │
         ├──────────────────────────────────────┤
         │  ┌────────────┐  ┌───────────────┐  │
         │  │   Product  │  │  AI Services  │  │
         │  │ Controller │  │   - GPT API   │  │
         │  └─────┬──────┘  └───────────────┘  │
         │        │                             │
         │  ┌─────▼──────────┐  ┌───────────┐  │
         │  │  WooCommerce   │  │  MongoDB  │  │
         │  │  Integration   │  │  Models   │  │
         │  └────────────────┘  └─────┬─────┘  │
         └──────────┬──────────────────┼────────┘
                    │                  │
         ┌──────────▼────────┐  ┌──────▼──────┐
         │   WooCommerce     │  │   MongoDB   │
         │    Store API      │  │   Database  │
         └───────────────────┘  └─────────────┘
```

## Data Flow

### 1. Product Creation Flow
```
User Input → AI Description Generator → Validate → Save to MongoDB → Mark as "Pending Sync"
```

### 2. Sync Flow
```
Get Pending Products → Transform to WooCommerce Format → POST/PUT to WooCommerce → Update Sync Status
```

### 3. AI Enhancement Flow
```
Product Title → AI Attribute Extractor → Suggested Attributes → User Confirms → Save
```

## Component Architecture

### Frontend Structure
```
src/
├── components/
│   ├── ProductForm.jsx          # Create/Edit products
│   ├── ProductList.jsx           # Display all products
│   ├── SyncDashboard.jsx         # Sync status & controls
│   ├── AIAssistant.jsx           # AI features panel
│   └── AttributeBuilder.jsx      # Dynamic attribute manager
├── services/
│   ├── api.js                    # API client
│   └── aiService.js              # AI integration
├── hooks/
│   └── useProducts.js            # Product state management
└── App.jsx
```

### Backend Structure
```
backend/
├── server.js                     # Express app entry
├── config/
│   ├── database.js               # MongoDB connection
│   └── woocommerce.js            # WooCommerce config
├── models/
│   ├── Product.js                # Product schema
│   └── SyncLog.js                # Sync history schema
├── routes/
│   ├── products.js               # Product CRUD routes
│   ├── sync.js                   # Sync routes
│   └── ai.js                     # AI routes
├── controllers/
│   ├── productController.js      # Product logic
│   ├── syncController.js         # Sync logic
│   └── aiController.js           # AI logic
├── services/
│   ├── woocommerceService.js     # WooCommerce API wrapper
│   └── aiService.js              # OpenAI integration
└── middleware/
    └── errorHandler.js           # Error handling
```

## Technology Choices & Rationale

### Database: MongoDB
- **Why**: Flexible schema for dynamic attributes (JSON storage)
- **Alternative**: JSON file for ultra-fast setup (recommended for 4-hour hackathon)

### Backend: Express.js
- **Why**: Fast setup, large ecosystem, easy API creation

### Frontend: React + Vite
- **Why**: Already set up, component-based, fast dev server

### AI: OpenAI GPT-3.5/4
- **Why**: Best-in-class for text generation and extraction
- **Alternative**: Anthropic Claude, local LLMs

## Key Design Decisions

### 1. Attribute Storage
Use JSON field in MongoDB to store dynamic attributes:
```json
{
  "name": "Blue T-Shirt",
  "attributes": {
    "color": "Blue",
    "size": ["S", "M", "L"],
    "material": "Cotton",
    "brand": "Nike"
  }
}
```

### 2. Sync Status Management
Three-state system:
- `pending`: New/updated, not synced
- `synced`: Successfully synced to WooCommerce
- `failed`: Sync error occurred

### 3. WooCommerce Mapping
```javascript
PIM Product → WooCommerce Product
{
  name → name
  description → description
  price → regular_price
  sku → sku
  images → images[{src}]
  attributes → attributes[{name, options}]
  category → categories[{id}]
}
```

## AI Integration Points

### 1. Product Description Generator
- **When**: User enters product name/title
- **How**: GPT-4 generates SEO-optimized description
- **Prompt**: "Generate a compelling product description for: {title}"

### 2. Attribute Extractor
- **When**: User enters product title
- **How**: AI extracts attributes (color, size, brand, etc.)
- **Prompt**: "Extract product attributes from: {title}. Return JSON: {color, size, brand, material}"

### 3. Data Validator
- **When**: Before saving/syncing
- **How**: AI validates data completeness and suggests improvements
- **Prompt**: "Validate this product data: {data}. Suggest improvements."

## Security Considerations

1. **API Keys**: Store in `.env` file (never commit)
2. **CORS**: Enable for frontend domain only
3. **Rate Limiting**: Add express-rate-limit for API protection
4. **Input Validation**: Use express-validator for all inputs

## Performance Optimizations

1. **Batch Sync**: Sync multiple products in parallel (limit: 5 concurrent)
2. **Caching**: Cache WooCommerce categories locally
3. **Pagination**: Paginate product list (50 per page)
4. **Debouncing**: Debounce AI requests (500ms)

## Error Handling Strategy

### Backend
```javascript
try {
  // operation
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Retry logic
  } else if (error.code === 'VALIDATION_ERROR') {
    // Return 400 with details
  } else {
    // Log & return 500
  }
}
```

### Frontend
```javascript
try {
  await api.createProduct(data);
  toast.success('Product created!');
} catch (error) {
  toast.error(error.message);
  // Rollback optimistic updates
}
```

## Scalability Considerations

For post-hackathon scaling:
1. Add Redis for caching
2. Implement job queue (Bull/BullMQ) for sync
3. Add WebSocket for real-time sync status
4. Implement search (Elasticsearch)
5. Add user authentication (JWT)
