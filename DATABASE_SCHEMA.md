# 📊 Database Schema Design

## MongoDB Collections

### 1. Products Collection

```javascript
{
  _id: ObjectId("..."),
  name: String,                    // Required
  description: String,             // AI-generated or manual
  price: Number,                   // Required
  compareAtPrice: Number,          // Optional (for sale prices)
  sku: String,                     // Unique, Required
  images: [String],                // Array of image URLs
  category: String,                // Simple category name
  woocommerceCategoryId: Number,   // WooCommerce category ID
  attributes: Object,              // Dynamic JSON structure
  stock: {
    quantity: Number,
    inStock: Boolean
  },
  syncStatus: String,              // "pending", "synced", "failed"
  woocommerceId: Number,           // WooCommerce product ID
  lastSyncedAt: Date,
  aiGenerated: {
    description: Boolean,
    attributes: Boolean
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    createdBy: String              // For future multi-user support
  }
}
```

**Indexes:**
```javascript
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ syncStatus: 1 })
db.products.createIndex({ woocommerceId: 1 })
db.products.createIndex({ "metadata.createdAt": -1 })
```

### 2. SyncLogs Collection

```javascript
{
  _id: ObjectId("..."),
  productId: ObjectId,             // Reference to Products
  productSku: String,
  action: String,                  // "create", "update", "delete"
  status: String,                  // "success", "failed"
  woocommerceId: Number,           // WooCommerce product ID
  request: Object,                 // Request payload sent
  response: Object,                // Response from WooCommerce
  error: {
    message: String,
    code: String,
    details: Object
  },
  duration: Number,                // Request duration in ms
  timestamp: Date
}
```

**Indexes:**
```javascript
db.syncLogs.createIndex({ productId: 1, timestamp: -1 })
db.syncLogs.createIndex({ status: 1 })
db.syncLogs.createIndex({ timestamp: -1 })
```

### 3. Categories Collection (Cache)

```javascript
{
  _id: ObjectId("..."),
  name: String,
  woocommerceId: Number,
  slug: String,
  parentId: Number,
  lastUpdated: Date
}
```

**Indexes:**
```javascript
db.categories.createIndex({ woocommerceId: 1 }, { unique: true })
db.categories.createIndex({ name: 1 })
```

### 4. AILogs Collection (Optional - for monitoring)

```javascript
{
  _id: ObjectId("..."),
  productId: ObjectId,
  feature: String,                 // "description", "attributes", "validation"
  prompt: String,
  response: String,
  tokens: Number,
  cost: Number,                    // Estimated cost in USD
  duration: Number,
  timestamp: Date
}
```

## Mongoose Models

### Product Model (backend/models/Product.js)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Must be a valid URL'
    }
  }],
  category: String,
  woocommerceCategoryId: Number,
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  stock: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'synced', 'failed'],
    default: 'pending'
  },
  woocommerceId: Number,
  lastSyncedAt: Date,
  aiGenerated: {
    description: {
      type: Boolean,
      default: false
    },
    attributes: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Virtual for sync status badge
productSchema.virtual('syncStatusBadge').get(function() {
  const badges = {
    pending: '⏳',
    synced: '✅',
    failed: '❌'
  };
  return badges[this.syncStatus] || '❓';
});

// Method to mark as pending when updated
productSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew && this.woocommerceId) {
    this.syncStatus = 'pending';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
```

### SyncLog Model (backend/models/SyncLog.js)

```javascript
const mongoose = require('mongoose');

const syncLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSku: String,
  action: {
    type: String,
    enum: ['create', 'update', 'delete'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  woocommerceId: Number,
  request: mongoose.Schema.Types.Mixed,
  response: mongoose.Schema.Types.Mixed,
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed
  },
  duration: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
syncLogSchema.index({ productId: 1, timestamp: -1 });
syncLogSchema.index({ status: 1 });

module.exports = mongoose.model('SyncLog', syncLogSchema);
```

## Alternative: JSON File Storage (Faster for Hackathon)

If MongoDB setup takes too long, use this simple JSON approach:

### data/products.json
```json
{
  "products": [],
  "syncLogs": [],
  "categories": []
}
```

### Simple File Storage Service (backend/services/fileStorage.js)
```javascript
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/products.json');

class FileStorage {
  async read() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { products: [], syncLogs: [], categories: [] };
    }
  }

  async write(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    const data = await this.read();
    return data.products;
  }

  async saveProduct(product) {
    const data = await this.read();
    product.id = Date.now().toString();
    product.createdAt = new Date().toISOString();
    product.updatedAt = new Date().toISOString();
    data.products.push(product);
    await this.write(data);
    return product;
  }

  async updateProduct(id, updates) {
    const data = await this.read();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    data.products[index] = { ...data.products[index], ...updates, updatedAt: new Date().toISOString() };
    await this.write(data);
    return data.products[index];
  }

  async deleteProduct(id) {
    const data = await this.read();
    data.products = data.products.filter(p => p.id !== id);
    await this.write(data);
  }

  async addSyncLog(log) {
    const data = await this.read();
    log.id = Date.now().toString();
    log.timestamp = new Date().toISOString();
    data.syncLogs.push(log);
    await this.write(data);
  }
}

module.exports = new FileStorage();
```

## Data Validation Rules

### Product Validation
```javascript
const productValidation = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  price: {
    required: true,
    min: 0,
    type: 'number'
  },
  sku: {
    required: true,
    pattern: /^[A-Z0-9-]+$/,
    unique: true
  },
  images: {
    type: 'array',
    maxLength: 10,
    itemPattern: /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i
  },
  attributes: {
    type: 'object',
    maxKeys: 20
  }
};
```

## Sample Data for Testing

```javascript
const sampleProducts = [
  {
    name: "Nike Air Max 270 - White",
    description: "Experience unparalleled comfort with Nike's Air Max 270 featuring the brand's biggest heel Air unit yet.",
    price: 150.00,
    sku: "NIKE-AM270-WHT-10",
    images: ["https://example.com/nike-white.jpg"],
    category: "Shoes",
    attributes: {
      brand: "Nike",
      color: "White",
      size: ["8", "9", "10", "11"],
      gender: "Unisex",
      material: "Mesh and Synthetic"
    },
    stock: {
      quantity: 50,
      inStock: true
    }
  },
  {
    name: "Samsung Galaxy Buds Pro - Black",
    description: "Immersive sound quality with intelligent ANC. Premium wireless earbuds engineered for all-day comfort.",
    price: 199.99,
    sku: "SAMSUNG-GBP-BLK",
    images: ["https://example.com/buds-pro.jpg"],
    category: "Electronics",
    attributes: {
      brand: "Samsung",
      color: "Black",
      connectivity: "Bluetooth 5.0",
      battery: "8 hours",
      features: ["ANC", "Water Resistant", "Wireless Charging"]
    },
    stock: {
      quantity: 25,
      inStock: true
    }
  }
];
```

## Migration Strategy

For moving from JSON to MongoDB later:
```javascript
// migration.js
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function migrate() {
  const data = JSON.parse(fs.readFileSync('./data/products.json'));
  
  for (const product of data.products) {
    await Product.create({
      ...product,
      _id: new mongoose.Types.ObjectId(),
      metadata: {
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  }
  
  console.log('Migration complete!');
}
```
