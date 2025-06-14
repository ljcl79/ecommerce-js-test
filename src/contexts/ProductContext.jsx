import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Without products`);
        } else if (response.status >= 500) {
          throw new Error('Failed to fetch product');
        } else {
          throw new Error(`Error code: ${response.status})`);
        }
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Without products`);
        } else if (response.status >= 500) {
          throw new Error('Failed to fetch product');
        } else {
          throw new Error(`Error code: ${response.status})`);
        }
      }

      const product = await response.json();
      return product;
    } catch (err) {
      setError(err.message);
      return null; // o lanza el error si prefieres manejarlo arriba
    } finally {
      setLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const getProductById = async (id) => {
    return await fetchProductById(id);
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const value = {
    products,
    categories,
    loading,
    error,
    getProductById,
    getProductsByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};