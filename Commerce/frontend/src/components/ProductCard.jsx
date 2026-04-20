import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product);
        toast.success(`${product.name} añadido al carrito`, {
            icon: '🛒',
            style: {
                borderRadius: '12px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                {product.imageUrl ? (
                    <img 
                        src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                        Only {product.stock} left
                    </span>
                )}
                {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                        Out of stock
                    </span>
                )}
            </Link>
            <div className="p-5">
                <div className="mb-3">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                        {product.category?.name || 'Category'}
                    </p>
                    <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                            product.stock === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
                        }`}
                        title="Add to cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
