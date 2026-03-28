const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/products.json');

class FileStorage {
  constructor() {
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it
      const dir = path.dirname(DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await this.write({ products: [], syncLogs: [], categories: [] });
    }
  }

  async read() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      return { products: [], syncLogs: [], categories: [] };
    }
  }

  async write(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  }

  // Products
  async getProducts(filter = {}) {
    const data = await this.read();
    let products = data.products;

    // Apply filters
    if (filter.syncStatus) {
      products = products.filter(p => p.syncStatus === filter.syncStatus);
    }
    if (filter.category) {
      products = products.filter(p => p.category === filter.category);
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    return products;
  }

  async getProductById(id) {
    const data = await this.read();
    return data.products.find(p => p.id === id);
  }

  async getProductBySku(sku) {
    const data = await this.read();
    return data.products.find(p => p.sku === sku);
  }

  async createProduct(product) {
    const data = await this.read();
    
    // Check for duplicate SKU
    if (data.products.some(p => p.sku === product.sku)) {
      throw new Error('Product with this SKU already exists');
    }

    const newProduct = {
      id: Date.now().toString(),
      ...product,
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.products.push(newProduct);
    await this.write(data);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const data = await this.read();
    const index = data.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    // If product has woocommerceId and is being updated, mark as pending
    if (data.products[index].woocommerceId) {
      updates.syncStatus = 'pending';
    }

    data.products[index] = {
      ...data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.write(data);
    return data.products[index];
  }

  async deleteProduct(id) {
    const data = await this.read();
    const index = data.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    data.products.splice(index, 1);
    await this.write(data);
    return true;
  }

  async getStats() {
    const data = await this.read();
    const products = data.products;

    const stats = {
      total: products.length,
      synced: products.filter(p => p.syncStatus === 'synced').length,
      pending: products.filter(p => p.syncStatus === 'pending').length,
      failed: products.filter(p => p.syncStatus === 'failed').length,
      categories: {}
    };

    // Count by category
    products.forEach(p => {
      if (p.category) {
        stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
      }
    });

    return stats;
  }

  // Sync Logs
  async addSyncLog(log) {
    const data = await this.read();
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...log
    };
    data.syncLogs.push(newLog);
    
    // Keep only last 1000 logs
    if (data.syncLogs.length > 1000) {
      data.syncLogs = data.syncLogs.slice(-1000);
    }
    
    await this.write(data);
    return newLog;
  }

  async getSyncLogs(filter = {}) {
    const data = await this.read();
    let logs = data.syncLogs;

    if (filter.productId) {
      logs = logs.filter(l => l.productId === filter.productId);
    }
    if (filter.status) {
      logs = logs.filter(l => l.status === filter.status);
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return logs;
  }

  // Categories
  async getCategories() {
    const data = await this.read();
    return data.categories;
  }

  async saveCategories(categories) {
    const data = await this.read();
    data.categories = categories.map(cat => ({
      ...cat,
      lastUpdated: new Date().toISOString()
    }));
    await this.write(data);
    return data.categories;
  }
}

module.exports = new FileStorage();
