import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    images: [],
    category: '',
    attributes: {},
    stock: {
      quantity: 0,
      inStock: true
    }
  });

  const [imageInput, setImageInput] = useState('');
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        sku: product.sku || '',
        images: Array.isArray(product.images) ? product.images : [],
        category: product.category || '',
        attributes: product.attributes || {},
        stock: product.stock || { quantity: 0, inStock: true }
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('stock.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        stock: {
          ...prev.stock,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const addImage = () => {
    if (imageInput.trim() && imageInput.match(/^https?:\/\/.+/)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    } else {
      alert('Please enter a valid image URL (must start with http:// or https://)');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeKey.trim()]: attributeValue.trim()
        }
      }));
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const removeAttribute = (key) => {
    setFormData(prev => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return { ...prev, attributes: newAttributes };
    });
  };

  const handleAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a product name first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiAPI.generateDescription({
        productName: formData.name,
        category: formData.category,
        attributes: formData.attributes
      });
      setFormData(prev => ({
        ...prev,
        description: response.data.data.description
      }));
    } catch (error) {
      alert(error.message || 'Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIAttributes = async () => {
    if (!formData.name) {
      alert('Please enter a product name first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiAPI.extractAttributes(formData.name);
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          ...response.data.data.attributes
        }
      }));
    } catch (error) {
      alert(error.message || 'Failed to extract attributes');
    } finally {
      setAiLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.sku || formData.sku.trim().length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>

      <div className="form-group">
        <label>Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Nike Air Max 270 - White"
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <button type="button" onClick={handleAIAttributes} disabled={aiLoading} className="btn-ai">
          ✨ Extract Attributes with AI
        </button>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Product description..."
        />
        <button type="button" onClick={handleAIDescription} disabled={aiLoading} className="btn-ai">
          ✨ Generate with AI
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="99.99"
            required
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="PROD-001"
            required
          />
          {errors.sku && <span className="error">{errors.sku}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Shoes, Electronics"
        />
      </div>

      <div className="form-group">
        <label>Images</label>
        <div className="image-input-group">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Enter image URL (https://...)"
          />
          <button type="button" onClick={addImage} className="btn-secondary">
            Add Image
          </button>
        </div>
        <div className="image-list">
          {formData.images.map((img, index) => (
            <div key={index} className="image-item">
              <img src={img} alt={`Product ${index + 1}`} />
              <button type="button" onClick={() => removeImage(index)} className="btn-remove">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Attributes</label>
        <div className="attribute-input-group">
          <input
            type="text"
            value={attributeKey}
            onChange={(e) => setAttributeKey(e.target.value)}
            placeholder="Key (e.g., color)"
          />
          <input
            type="text"
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            placeholder="Value (e.g., Blue)"
          />
          <button type="button" onClick={addAttribute} className="btn-secondary">
            Add
          </button>
        </div>
        <div className="attribute-list">
          {Object.entries(formData.attributes).map(([key, value]) => (
            <div key={key} className="attribute-item">
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              <button type="button" onClick={() => removeAttribute(key)} className="btn-remove">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock.quantity"
            value={formData.stock.quantity}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="stock.inStock"
              checked={formData.stock.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={aiLoading}>
          {product ? 'Update Product' : 'Create Product'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
