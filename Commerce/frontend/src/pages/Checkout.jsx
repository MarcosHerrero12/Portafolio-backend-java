import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (cart.length === 0 && !success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        
        const orderRequest = {
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            // 1. Crear el pedido
            const orderResponse = await api.post('/orders', orderRequest);
            const orderId = orderResponse.data.id;

            // 2. Crear la preferencia de Mercado Pago
            const paymentResponse = await api.post(`/payments/create-preference/${orderId}`);
            const { initPoint } = paymentResponse.data;

            // 3. Limpiar carrito y redirigir a Mercado Pago
            clearCart();
            window.location.href = initPoint;
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar el pago. Intenta de nuevo.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">¡Pedido Confirmado!</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md">
                    Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                    Continuar comprando
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                    <div className="divide-y divide-gray-100">
                        {cart.map((item) => (
                            <div key={item.id} className="py-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-medium text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                        Procesando...
                    </>
                ) : (
                    `Pagar $${totalPrice.toFixed(2)} con Mercado Pago`
                )}
            </button>
            <p className="mt-4 text-center text-sm text-gray-500">
                Serás redirigido a la plataforma segura de Mercado Pago.
            </p>
        </div>
    );
};

export default Checkout;
