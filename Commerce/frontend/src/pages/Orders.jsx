import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Calendar, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-500 mb-8">Cuando realices una compra, aparecerá aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50/50 p-4 sm:p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Pedido realizado</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                  <p className="text-gray-900 font-bold">${order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Completado
                </span>
                <span className="text-gray-400">#ORD-{order.id}</span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"} 
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-gray-900">{item.product?.name}</h4>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
