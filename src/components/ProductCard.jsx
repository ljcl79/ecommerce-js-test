import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      addToCart(product);
    }
  };

  const truncateTitle = (title, maxLength = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300 p-4"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            {truncateTitle(product.title)}
          </h3>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">
                {product.rating?.rate} ({product.rating?.count})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            
            {user && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline text-sm">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;