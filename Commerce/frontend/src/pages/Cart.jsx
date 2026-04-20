import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8 max-w-xs">Parece que aún no has añadido nada a tu carrito. ¡Explora nuestros productos!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Productos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">{item.description}</p>
                <div className="text-xl font-bold text-indigo-600">
                  ${item.price.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-indigo-600 shadow-sm border border-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-indigo-600 shadow-sm border border-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                title="Eliminar producto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
        </div>

        {/* Resumen de Compra */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen de compra</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} productos)</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full py-4 bg-indigo-600 text-white text-center rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mb-4"
            >
              Confirmar pedido
            </Link>
            
            <p className="text-xs text-gray-400 text-center">
              * Los impuestos se calcularán al finalizar la compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
