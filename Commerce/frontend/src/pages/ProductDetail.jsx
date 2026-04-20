import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Loader2, ArrowLeft, ShoppingCart, Check, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/products/${id}/reviews`);
            setReviews(response.data);
        } catch (err) {
            console.error('Error fetching reviews');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/products/${id}/reviews`, newReview);
            toast.success('Reseña publicada');
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            toast.error('Error al publicar reseña. ¿Ya iniciaste sesión?');
        }
    };

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-500">
                {error || 'Product not found'}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to products
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 aspect-square flex items-center justify-center relative">
                        {product.imageUrl ? (
                            <img 
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`} 
                                alt={product.name} 
                                className="object-cover w-full h-full" 
                            />
                        ) : (
                            <span className="text-gray-400">No image available</span>
                        )}
                    </div>
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-2 uppercase text-sm tracking-widest text-indigo-600 font-semibold">
                            {product.category?.name || 'Category'}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</div>
                        
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-4 mb-8">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                product.stock > 10 ? 'bg-green-100 text-green-800' :
                                product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                            </span>
                            {product.seller && (
                                <span className="text-sm text-gray-500">Vendido por <span className="font-bold text-gray-700">{product.seller.companyName}</span></span>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white transition-all ${
                                product.stock === 0 
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : added 
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                        >
                            {added ? (
                                <>
                                    <Check className="w-5 h-5 mr-2" /> Agregado
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Agregar al Carrito
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Opiniones de clientes</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-5 h-5 ${Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) >= star ? 'fill-current' : ''}`} />
                            ))}
                        </div>
                        <span className="text-gray-500 font-medium">({reviews.length} reseñas)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Formulario de Reseña */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Deja tu opinión</h3>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div className="flex gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star className={`w-6 h-6 ${newReview.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="¿Qué te pareció el producto?"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all text-sm"
                                >
                                    Publicar reseña
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Reseñas */}
                    <div className="lg:col-span-2 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">Aún no hay reseñas para este producto. ¡Sé el primero!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                {review.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{review.user?.name}</h4>
                                                <div className="flex text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`w-3.5 h-3.5 ${review.rating >= star ? 'fill-current' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
