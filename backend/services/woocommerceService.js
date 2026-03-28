const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

class WooCommerceService {
  constructor() {
    this.api = null;
    this.categoryCache = new Map(); // Cache for category name -> ID mapping
    this.initializeAPI();
  }

  initializeAPI() {
    if (!process.env.WC_STORE_URL || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
      console.warn('⚠️  WooCommerce credentials not configured');
      return;
    }

    this.api = new WooCommerceRestApi({
      url: process.env.WC_STORE_URL,
      consumerKey: process.env.WC_CONSUMER_KEY,
      consumerSecret: process.env.WC_CONSUMER_SECRET,
      version: 'wc/v3'
    });
    
    console.log(`✅ WooCommerce initialized - Store: ${process.env.WC_STORE_URL}`);
  }

  isConfigured() {
    return this.api !== null;
  }

  // Get or create category by name
  async getCategoryIdByName(categoryName) {
    if (!categoryName) return null;

    // Check cache first
    if (this.categoryCache.has(categoryName)) {
      return this.categoryCache.get(categoryName);
    }

    try {
      // Search for existing category
      const response = await this.api.get('products/categories', {
        search: categoryName,
        per_page: 1
      });

      if (response.data && response.data.length > 0) {
        const categoryId = response.data[0].id;
        this.categoryCache.set(categoryName, categoryId);
        return categoryId;
      }

      // If not found, create new category
      const newCategoryResponse = await this.api.post('products/categories', {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-')
      });

      const categoryId = newCategoryResponse.data.id;
      this.categoryCache.set(categoryName, categoryId);
      console.log(`✅ Created category: ${categoryName} (ID: ${categoryId})`);
      return categoryId;
    } catch (error) {
      console.error(`❌ Error with category "${categoryName}":`, error.message);
      return null;
    }
  }

  // Transform PIM product to WooCommerce format
  async transformProduct(product, includeImages = false) {
    const wcProduct = {
      name: product.name,
      type: 'simple',
      regular_price: product.price.toString(),
      description: product.description || '',
      short_description: product.shortDescription || '',
      sku: product.sku,
      manage_stock: true,
      stock_quantity: product.stock?.quantity || 0,
      in_stock: product.stock?.inStock !== false,
      attributes: this.transformAttributes(product.attributes || {})
    };

    // Handle categories - use category name or woocommerceCategoryId
    if (product.woocommerceCategoryId) {
      wcProduct.categories = [{ id: product.woocommerceCategoryId }];
    } else if (product.category) {
      const categoryId = await this.getCategoryIdByName(product.category);
      if (categoryId) {
        wcProduct.categories = [{ id: categoryId }];
      }
    }

    // Only include images if enabled and available
    if (includeImages && product.images && product.images.length > 0) {
      wcProduct.images = product.images.map(url => ({ src: url }));
    }

    // Add sale price if compareAtPrice exists
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      wcProduct.sale_price = product.price.toString();
      wcProduct.regular_price = product.compareAtPrice.toString();
    }

    return wcProduct;
  }

  // Transform attributes to WooCommerce format
  transformAttributes(attributes) {
    return Object.entries(attributes).map(([name, value]) => {
      const options = Array.isArray(value) ? value : [value.toString()];
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        options: options,
        visible: true,
        variation: false
      };
    });
  }

  // Create product in WooCommerce
  async createProduct(product) {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const wcProduct = await this.transformProduct(product);
      const response = await this.api.post('products', wcProduct);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update product in WooCommerce
  async updateProduct(woocommerceId, product) {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const wcProduct = await this.transformProduct(product);
      const response = await this.api.put(`products/${woocommerceId}`, wcProduct);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete product from WooCommerce
  async deleteProduct(woocommerceId) {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const response = await this.api.delete(`products/${woocommerceId}`, {
        force: true
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get product from WooCommerce
  async getProduct(woocommerceId) {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const response = await this.api.get(`products/${woocommerceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all categories
  async getCategories() {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const response = await this.api.get('products/categories', {
        per_page: 100
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Test connection
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        connected: false,
        error: 'WooCommerce credentials not configured'
      };
    }

    try {
      const response = await this.api.get('system_status');
      return {
        connected: true,
        storeUrl: process.env.WC_STORE_URL,
        woocommerceVersion: response.data.environment?.version || 'unknown'
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // WooCommerce API error
      const { status, data } = error.response;
      const wcError = new Error(data.message || 'WooCommerce API error');
      wcError.statusCode = status;
      wcError.code = data.code || 'WOOCOMMERCE_ERROR';
      wcError.details = data;
      return wcError;
    } else if (error.request) {
      // Network error
      const networkError = new Error('Unable to connect to WooCommerce store');
      networkError.code = 'NETWORK_ERROR';
      return networkError;
    } else {
      return error;
    }
  }

  // Batch operations
  async batchUpdate(products) {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce not configured');
    }

    try {
      const create = [];
      const update = [];

      products.forEach(product => {
        const wcProduct = this.transformProduct(product);
        if (product.woocommerceId) {
          update.push({ id: product.woocommerceId, ...wcProduct });
        } else {
          create.push(wcProduct);
        }
      });

      const response = await this.api.post('products/batch', {
        create,
        update
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

module.exports = new WooCommerceService();
