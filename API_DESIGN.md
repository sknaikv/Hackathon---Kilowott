# 🔌 API Design & Endpoints

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## API Endpoints

### 📦 Products

#### GET /products
Get all products with pagination and filtering

**Query Parameters:**
```javascript
{
  page: 1,              // Page number (default: 1)
  limit: 50,            // Items per page (default: 50)
  syncStatus: 'pending', // Filter by sync status
  category: 'Shoes',    // Filter by category
  search: 'Nike'        // Search in name/sku/description
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    products: [...],
    pagination: {
      page: 1,
      limit: 50,
      total: 150,
      pages: 3
    }
  }
}
```

#### GET /products/:id
Get single product by ID

**Response:**
```javascript
{
  success: true,
  data: {
    _id: "...",
    name: "Nike Air Max 270",
    price: 150.00,
    // ... full product data
  }
}
```

#### POST /products
Create new product

**Request Body:**
```javascript
{
  name: "Product Name",
  description: "Product description",
  price: 99.99,
  sku: "PROD-001",
  images: ["https://..."],
  category: "Category Name",
  attributes: {
    color: "Blue",
    size: ["S", "M", "L"]
  },
  stock: {
    quantity: 100,
    inStock: true
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    _id: "...",
    // ... created product
  },
  message: "Product created successfully"
}
```

#### PUT /products/:id
Update existing product

**Request Body:** (Same as POST, all fields optional)

**Response:**
```javascript
{
  success: true,
  data: {
    // ... updated product
  },
  message: "Product updated successfully"
}
```

#### DELETE /products/:id
Delete product

**Response:**
```javascript
{
  success: true,
  message: "Product deleted successfully"
}
```

#### GET /products/stats
Get product statistics

**Response:**
```javascript
{
  success: true,
  data: {
    total: 150,
    synced: 120,
    pending: 25,
    failed: 5,
    categories: {
      "Shoes": 50,
      "Electronics": 30,
      "Clothing": 70
    }
  }
}
```

---

### 🔄 Synchronization

#### POST /sync/product/:id
Sync single product to WooCommerce

**Response:**
```javascript
{
  success: true,
  data: {
    productId: "...",
    woocommerceId: 123,
    action: "created", // or "updated"
    syncStatus: "synced"
  },
  message: "Product synced successfully"
}
```

#### POST /sync/batch
Sync multiple products

**Request Body:**
```javascript
{
  productIds: ["id1", "id2", "id3"]
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    successful: 2,
    failed: 1,
    results: [
      { productId: "id1", status: "success", woocommerceId: 123 },
      { productId: "id2", status: "success", woocommerceId: 124 },
      { productId: "id3", status: "failed", error: "Invalid SKU" }
    ]
  }
}
```

#### POST /sync/all-pending
Sync all pending products

**Response:**
```javascript
{
  success: true,
  data: {
    total: 25,
    successful: 23,
    failed: 2,
    duration: 4500 // ms
  }
}
```

#### GET /sync/status/:productId
Get sync status and history for a product

**Response:**
```javascript
{
  success: true,
  data: {
    currentStatus: "synced",
    woocommerceId: 123,
    lastSyncedAt: "2024-03-28T10:30:00Z",
    history: [
      {
        action: "update",
        status: "success",
        timestamp: "2024-03-28T10:30:00Z",
        duration: 850
      },
      {
        action: "create",
        status: "success",
        timestamp: "2024-03-27T15:20:00Z",
        duration: 1200
      }
    ]
  }
}
```

#### GET /sync/logs
Get all sync logs with filtering

**Query Parameters:**
```javascript
{
  page: 1,
  limit: 50,
  status: 'failed',     // Filter by status
  productId: '...',     // Filter by product
  startDate: '2024-03-01',
  endDate: '2024-03-28'
}
```

---

### 🤖 AI Features

#### POST /ai/generate-description
Generate product description using AI

**Request Body:**
```javascript
{
  productName: "Nike Air Max 270 - White",
  category: "Shoes",
  attributes: {
    brand: "Nike",
    color: "White",
    size: ["8", "9", "10"]
  },
  tone: "professional" // optional: casual, professional, enthusiastic
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    description: "Experience unparalleled comfort with Nike's Air Max 270...",
    metadata: {
      tokens: 120,
      model: "gpt-3.5-turbo",
      duration: 1200
    }
  }
}
```

#### POST /ai/extract-attributes
Extract attributes from product title

**Request Body:**
```javascript
{
  productTitle: "Samsung Galaxy S23 Ultra 256GB Phantom Black Unlocked"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    attributes: {
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      storage: "256GB",
      color: "Phantom Black",
      carrier: "Unlocked"
    },
    confidence: 0.95
  }
}
```

#### POST /ai/validate-product
Validate product data and get suggestions

**Request Body:**
```javascript
{
  product: {
    name: "Nike Shoe",
    price: 150,
    description: "A shoe",
    sku: "PROD-001"
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    isValid: false,
    issues: [
      {
        field: "name",
        severity: "warning",
        message: "Product name is too generic. Consider adding model and color."
      },
      {
        field: "description",
        severity: "error",
        message: "Description is too short. Minimum 50 characters recommended."
      }
    ],
    suggestions: {
      name: "Nike Air Max 270 - White",
      description: "Experience comfort with Nike's Air Max 270...",
      missingAttributes: ["size", "color", "material"]
    }
  }
}
```

#### POST /ai/bulk-enhance
Enhance multiple products with AI

**Request Body:**
```javascript
{
  productIds: ["id1", "id2"],
  enhancements: ["description", "attributes"]
}
```

---

### 📁 Categories

#### GET /categories
Get all categories (cached from WooCommerce)

**Response:**
```javascript
{
  success: true,
  data: [
    {
      id: 1,
      name: "Shoes",
      woocommerceId: 15,
      slug: "shoes",
      parentId: null
    },
    {
      id: 2,
      name: "Running Shoes",
      woocommerceId: 16,
      slug: "running-shoes",
      parentId: 15
    }
  ]
}
```

#### POST /categories/sync
Fetch and cache categories from WooCommerce

**Response:**
```javascript
{
  success: true,
  data: {
    synced: 25,
    message: "Categories synced successfully"
  }
}
```

---

### 🔧 WooCommerce Configuration

#### GET /woocommerce/test
Test WooCommerce connection

**Response:**
```javascript
{
  success: true,
  data: {
    connected: true,
    storeUrl: "https://yourstore.com",
    woocommerceVersion: "8.5.2",
    productsCount: 150
  }
}
```

#### PUT /woocommerce/config
Update WooCommerce credentials (for demo purposes)

**Request Body:**
```javascript
{
  storeUrl: "https://yourstore.com",
  consumerKey: "ck_...",
  consumerSecret: "cs_..."
}
```

---

## Error Responses

All endpoints follow consistent error format:

### Validation Error (400)
```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: [
      {
        field: "price",
        message: "Price must be a positive number"
      },
      {
        field: "sku",
        message: "SKU already exists"
      }
    ]
  }
}
```

### Not Found (404)
```javascript
{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Product not found"
  }
}
```

### WooCommerce Error (502)
```javascript
{
  success: false,
  error: {
    code: "WOOCOMMERCE_ERROR",
    message: "Failed to sync with WooCommerce",
    details: {
      statusCode: 401,
      message: "Invalid consumer key"
    }
  }
}
```

### AI Service Error (503)
```javascript
{
  success: false,
  error: {
    code: "AI_SERVICE_ERROR",
    message: "AI service temporarily unavailable",
    details: "Rate limit exceeded"
  }
}
```

### Server Error (500)
```javascript
{
  success: false,
  error: {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred"
  }
}
```

---

## Request/Response Examples

### Example: Create Product with AI Description

**Step 1: Extract attributes**
```bash
POST /api/ai/extract-attributes
{
  "productTitle": "Nike Air Max 270 White Size 10"
}

Response:
{
  "attributes": {
    "brand": "Nike",
    "model": "Air Max 270",
    "color": "White",
    "size": "10"
  }
}
```

**Step 2: Generate description**
```bash
POST /api/ai/generate-description
{
  "productName": "Nike Air Max 270 White Size 10",
  "category": "Shoes",
  "attributes": { ... }
}

Response:
{
  "description": "Experience unparalleled comfort..."
}
```

**Step 3: Create product**
```bash
POST /api/products
{
  "name": "Nike Air Max 270 White Size 10",
  "description": "Experience unparalleled comfort...",
  "price": 150.00,
  "sku": "NIKE-AM270-WHT-10",
  "attributes": { ... },
  "aiGenerated": {
    "description": true,
    "attributes": true
  }
}
```

**Step 4: Sync to WooCommerce**
```bash
POST /api/sync/product/{productId}

Response:
{
  "success": true,
  "woocommerceId": 123,
  "syncStatus": "synced"
}
```

---

## Rate Limiting

```javascript
// Apply to all routes
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Stricter limit for AI endpoints
app.use('/api/ai/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20 // AI calls are expensive
}));
```

---

## Authentication (Future Enhancement)

For production, add JWT authentication:

```javascript
// All endpoints require:
Headers: {
  'Authorization': 'Bearer <jwt_token>'
}

// Login endpoint:
POST /auth/login
{
  email: "user@example.com",
  password: "password"
}

Response:
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: { id, name, email }
}
```

---

## WebSocket Events (Future Enhancement)

For real-time sync updates:

```javascript
// Client connects to ws://localhost:5000
socket.on('sync:started', (data) => {
  // { productId, totalProducts }
});

socket.on('sync:progress', (data) => {
  // { completed, total, currentProduct }
});

socket.on('sync:completed', (data) => {
  // { successful, failed, duration }
});

socket.on('sync:error', (data) => {
  // { productId, error }
});
```
