import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import PaymentStatus from './pages/PaymentStatus';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Toaster position="bottom-right" reverseOrder={false} />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route 
                  path="/orders" 
                  element={
                    <RequireAuth>
                      <Orders />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <RequireAuth>
                      <AdminDashboard />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  } 
                />
                <Route path="/payment/:status" element={<PaymentStatus />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
