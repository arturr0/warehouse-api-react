import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from './Chart';

const Warehouse = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '' });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || isNaN(newProduct.quantity)) return;
    
    const res = await axios.post('/api/products', newProduct);
    setProducts([res.data, ...products]);  // Prepend new product
    setNewProduct({ name: '', quantity: '' });
  };

  // Example for handleUpdate:
const handleUpdate = async (id, name, quantity) => {
  try {
    await axios.put(`/api/products/${id}`, { name, quantity });
    fetchProducts();
  } catch (error) {
    console.error('Update failed:', error);
    alert(`Update failed: ${error.response?.data?.error || error.message}`);
  }
};
  
  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const handleIncrement = async (id) => {
    try {
      await axios.post(`/api/products/quantity/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Increment failed:', error.response?.data?.error || error.message);
      alert(`Increment failed: ${error.response?.data?.error || 'Server error'}`);
    }
  };
  
  const handleDecrement = async (id) => {
    try {
      await axios.post(`/api/products/down/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Decrement failed:', error.response?.data?.error || error.message);
      alert(`Decrement failed: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  return (
    <div className="warehouse-container">
      <div className="warehouse-section">
        <h1>WAREHOUSE MANAGEMENT</h1>
        
        <button className="btn-primary" onClick={fetchProducts}>
          REFRESH PRODUCTS
        </button>
        
        <form onSubmit={handleCreate} className="create-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Enter product name"
            />
          </div>
          
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
              placeholder="Enter quantity"
            />
          </div>
          
          <button type="submit" className="btn-create">
            ADD PRODUCT
          </button>
        </form>
        
        <div className="divider"></div>
        
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="chart-section">
        <Chart products={products} />
      </div>
    </div>
  );
};

const ProductRow = ({ product, onUpdate, onDelete, onIncrement, onDecrement }) => {
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity);
  
  useEffect(() => {
    setName(product.name);
    setQuantity(product.quantity);
  }, [product]);

  return (
    <tr>
      <td>{product._id}</td>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="table-input"
        />
      </td>
      <td>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="table-input"
        />
      </td>
      <td className="actions">
        <button className="btn-update" onClick={() => onUpdate(product._id, name, quantity)}>
          UPDATE
        </button>
        <button className="btn-delete" onClick={() => onDelete(product._id)}>
          DELETE
        </button>
        <div className="quantity-controls">
          <button className="btn-increment" onClick={() => onIncrement(product._id)}>+</button>
          <button className="btn-decrement" onClick={() => onDecrement(product._id)}>-</button>
        </div>
      </td>
    </tr>
  );
};

export default Warehouse;