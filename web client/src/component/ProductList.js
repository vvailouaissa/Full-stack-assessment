import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function ProductList({ authHeader }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFetchOptions = (method = 'GET', body = null) => ({
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': authHeader 
    },
    ...(body && { body: JSON.stringify(body) })
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products', getFetchOptions());
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts().catch((error) => {
      console.error('Error in loadProducts:', error);
      setError('Failed to load products');
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && isNaN(value)) return;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setError('Name and Price are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products', 
        getFetchOptions('POST', {
          ...newProduct,
          price: parseFloat(newProduct.price)
        })
      );
      if (!response.ok) throw new Error('Failed to add product');
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '' });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${id}`, 
        getFetchOptions('DELETE')
      );
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (product) => {
    const updatedName = prompt('Enter new name', product.name);
    if (updatedName && updatedName !== product.name) {
      setLoading(true);
      setError(null);
      try {
        const updatedProduct = { ...product, name: updatedName };
        const response = await fetch(`/api/products/${product.id}`, 
          getFetchOptions('PUT', updatedProduct)
        );
        if (!response.ok) throw new Error('Failed to update product');
        const data = await response.json();
        setProducts(products.map((p) => (p.id === product.id ? data : p)));
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <div>
                <button className="edit-btn" onClick={() => handleUpdate(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Add New Product</h3>
      <form onSubmit={handleAddProduct} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

ProductList.propTypes = {
  authHeader: PropTypes.string.isRequired
};

export default ProductList;
