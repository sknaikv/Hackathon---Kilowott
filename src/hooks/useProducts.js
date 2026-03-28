import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching products with params:', params);
      const response = await productsAPI.getAll(params);
      console.log('✅ Products fetched:', response.data.data.products.length);
      setProducts(response.data.data.products);
      return response.data.data;
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats...');
      const response = await productsAPI.getStats();
      console.log('✅ Stats fetched successfully');
      setStats(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error('⚠️ Failed to fetch stats (non-critical):', err.message);
      // Don't throw - stats are not critical
      setStats(null);
      return null;
    }
  };

  const createProduct = async (data) => {
    try {
      const response = await productsAPI.create(data);
      await fetchProducts();
      await fetchStats();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await productsAPI.update(id, data);
      await fetchProducts();
      await fetchStats();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      throw err;
    }
  };

  // Fetch on mount only
  useEffect(() => {
    console.log('🎯 useProducts hook mounted - fetching initial data');
    
    // Fetch products
    fetchProducts()
      .then(() => {
        console.log('✅ Initial products fetch completed');
      })
      .catch(err => {
        console.error('❌ Initial fetch failed:', err.message);
        // setError will already be set in fetchProducts
      });
    
    // Fetch stats (non-blocking)
    fetchStats().catch(err => {
      console.error('⚠️ Stats fetch failed:', err.message);
      // Don't fail the whole app if stats fail
    });
  }, []); // Empty dependency array - only once on mount

  console.log('useProducts returning:', { productsCount: products.length, loading, error });

  return {
    products,
    loading,
    error,
    stats,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshStats: fetchStats
  };
};
