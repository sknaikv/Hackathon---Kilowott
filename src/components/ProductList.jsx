import React, { useState } from 'react';
import { syncAPI } from '../services/api';
import './ProductList.css';

const ProductList = ({ products, onEdit, onDelete, onRefresh }) => {
  const [syncing, setSyncing] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);

  const getSyncBadge = (status) => {
    const badges = {
      synced: { emoji: '✅', text: 'Synced', class: 'synced' },
      pending: { emoji: '⏳', text: 'Pending', class: 'pending' },
      failed: { emoji: '❌', text: 'Failed', class: 'failed' }
    };
    return badges[status] || badges.pending;
  };

  const handleSync = async (productId) => {
    setSyncing(prev => ({ ...prev, [productId]: true }));
    try {
      await syncAPI.syncProduct(productId);
      onRefresh();
      alert('Product synced successfully!');
    } catch (error) {
      alert(error.message || 'Failed to sync product');
    } finally {
      setSyncing(prev => ({ ...prev, [productId]: false }));
    }
  };

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (!products || products.length === 0) {
    console.log('ProductList: No products or empty array', { products, hasProducts: products && products.length > 0 });
    return (
      <div className="empty-state">
        <h3>No products yet</h3>
        <p>Create your first product to get started</p>
      </div>
    );
  }

  console.log('ProductList: Rendering', products.length, 'products');

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Sync Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td>
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>
                <td>
                  <strong>{product.name}</strong>
                  {product.aiGenerated?.description && <span className="ai-badge" title="AI Generated">✨</span>}
                </td>
                <td><code>{product.sku}</code></td>
                <td>${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}</td>
                <td>{product.category || '-'}</td>
                <td>
                  {product.stock?.inStock ? (
                    <span className="in-stock">✓ {product.stock.quantity || 0}</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </td>
                <td>
                  {(() => {
                    const badge = getSyncBadge(product.syncStatus);
                    return (
                      <span className={`sync-badge ${badge.class}`}>
                        {badge.emoji} {badge.text}
                      </span>
                    );
                  })()}
                  {product.woocommerceId && (
                    <div className="wc-id">WC ID: {product.woocommerceId}</div>
                  )}
                </td>
                <td className="actions">
                  <button 
                    onClick={() => toggleExpand(product.id)}
                    className="btn-icon"
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={() => onEdit(product)}
                    className="btn-icon"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleSync(product.id)}
                    disabled={syncing[product.id]}
                    className="btn-icon"
                    title="Sync to WooCommerce"
                  >
                    {syncing[product.id] ? '⏳' : '🔄'}
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        onDelete(product.id);
                      }
                    }}
                    className="btn-icon btn-danger"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              {expandedProduct === product.id && (
                <tr className="expanded-row">
                  <td colSpan="8">
                    <div className="product-details">
                      <div className="detail-section">
                        <h4>Description</h4>
                        <p>{product.description || 'No description'}</p>
                      </div>
                      {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <div className="detail-section">
                          <h4>Attributes</h4>
                          <div className="attributes-grid">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <div key={key} className="attribute">
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.images && product.images.length > 1 && (
                        <div className="detail-section">
                          <h4>All Images</h4>
                          <div className="images-grid">
                            {product.images.map((img, idx) => (
                              <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="detail-section">
                        <h4>Metadata</h4>
                        <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleString()}</p>
                        <p><strong>Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
                        {product.lastSyncedAt && (
                          <p><strong>Last Synced:</strong> {new Date(product.lastSyncedAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
