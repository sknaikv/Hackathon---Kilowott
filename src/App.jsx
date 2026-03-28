import React, { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import SyncDashboard from './components/SyncDashboard';
import './App.css';

function App() {
  const { products, loading, error, stats, createProduct, updateProduct, deleteProduct, fetchProducts, refreshStats } = useProducts();
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState({ syncStatus: '', search: '' });

  // Debug log
  useEffect(() => {
    console.log('App state:', { products: products.length, loading, error, view });
  }, [products, loading, error, view]);

  const handleCreateProduct = async (data) => {
    try {
      await createProduct(data);
      setView('list');
      alert('Product created successfully!');
    } catch (error) {
      alert(error.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (data) => {
    try {
      await updateProduct(selectedProduct.id, data);
      setView('list');
      setSelectedProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      alert('Product deleted successfully!');
    } catch (error) {
      alert(error.message || 'Failed to delete product');
    }
  };

  const handleRefresh = () => {
    fetchProducts(filter);
    refreshStats();
  };

  const applyFilter = () => {
    const params = {};
    if (filter.syncStatus) params.syncStatus = filter.syncStatus;
    if (filter.search) params.search = filter.search;
    fetchProducts(params);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📦 PIM System</h1>
          <p className="tagline">Product Information Management with WooCommerce Integration</p>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={view === 'list' ? 'active' : ''} 
          onClick={() => setView('list')}
        >
          📋 Products
        </button>
        <button 
          className={view === 'dashboard' ? 'active' : ''} 
          onClick={() => setView('dashboard')}
        >
          📊 Sync Dashboard
        </button>
        <button 
          className={view === 'create' ? 'active' : ''} 
          onClick={() => setView('create')}
        >
          ➕ Create Product
        </button>
      </nav>

      <main className="app-main">
        {error && (
          <div className="error-banner" style={{padding: '20px', background: '#fee', color: '#c00', marginBottom: '20px', borderRadius: '4px'}}>
            <strong>Error:</strong> {error}
            <br />
            <small>Check console for details. The app will still work with cached data.</small>
          </div>
        )}

        {view === 'dashboard' && (
          <SyncDashboard stats={stats} onRefresh={handleRefresh} />
        )}

        {view === 'list' && (
          <div className="products-view">
            <div className="view-header">
              <h2>Products ({products.length})</h2>
              <div className="filters">
                <select 
                  value={filter.syncStatus} 
                  onChange={(e) => setFilter({ ...filter, syncStatus: e.target.value })}
                >
                  <option value="">All Sync Status</option>
                  <option value="synced">Synced</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilter()}
                />
                <button onClick={applyFilter} className="btn-secondary">
                  🔍 Search
                </button>
                <button onClick={() => {
                  setFilter({ syncStatus: '', search: '' });
                  fetchProducts();
                }} className="btn-secondary">
                  🔄 Reset
                </button>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="loading" style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                ⏳ Loading products...
              </div>
            ) : products.length === 0 ? (
              <div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
                <p>No products found. {error ? '(Check error message above)' : ''}</p>
              </div>
            ) : (
              <ProductList 
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
              />
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="form-view">
            <ProductForm 
              onSubmit={handleCreateProduct}
              onCancel={() => setView('list')}
            />
          </div>
        )}

        {view === 'edit' && selectedProduct && (
          <div className="form-view">
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => {
                setView('list');
                setSelectedProduct(null);
              }}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>PIM System © 2026 | Powered by AI ✨</p>
      </footer>
    </div>
  );
}

export default App;
