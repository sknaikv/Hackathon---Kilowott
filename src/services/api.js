import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log('✅ API Response Success:', response.config.url);
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.error?.message || 
                          error.response.data?.message ||
                          error.response.statusText ||
                          'API Error';
      const customError = new Error(errorMessage);
      customError.code = error.response.data?.error?.code || 'API_ERROR';
      customError.status = error.response.status;
      throw customError;
    } else if (error.request) {
      // Network error
      const networkError = new Error(`Unable to connect to server at ${API_BASE_URL}`);
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    } else {
      throw error;
    }
  }
);

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    console.log('📡 Fetching products with params:', params);
    return api.get('/products', { params });
  },
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getStats: () => {
    console.log('📊 Fetching stats');
    return api.get('/products/stats');
  }
};

// Sync API
export const syncAPI = {
  syncProduct: (id) => api.post(`/sync/product/${id}`),
  syncBatch: (productIds) => api.post('/sync/batch', { productIds }),
  syncAllPending: () => api.post('/sync/all-pending'),
  getStatus: (productId) => api.get(`/sync/status/${productId}`),
  getLogs: (params = {}) => api.get('/sync/logs', { params })
};

// AI API
export const aiAPI = {
  generateDescription: (data) => api.post('/ai/generate-description', data),
  extractAttributes: (productTitle) => api.post('/ai/extract-attributes', { productTitle }),
  validateProduct: (product) => api.post('/ai/validate-product', { product }),
  bulkEnhance: (productIds, enhancements) => api.post('/ai/bulk-enhance', { productIds, enhancements })
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  sync: () => api.post('/categories/sync')
};

// WooCommerce API
export const woocommerceAPI = {
  test: () => api.get('/woocommerce/test')
};

export default api;
