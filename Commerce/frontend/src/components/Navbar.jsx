import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Package className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-xl text-gray-900 tracking-tight">TechCommerce</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <Link 
                                    to="/orders" 
                                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                    title="Mis Pedidos"
                                >
                                    <Package className="h-5 w-5" />
                                    <span className="hidden lg:block">Mis Pedidos</span>
                                </Link>

                                {(user.role?.toUpperCase() === 'ADMIN' || user.role?.toUpperCase() === 'SELLER') && (
                                    <Link 
                                        to="/admin" 
                                        className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2 text-sm font-bold"
                                        title={user.role === 'ADMIN' ? 'Panel Admin' : 'Mi Panel'}
                                    >
                                        <UserIcon className="h-5 w-5" />
                                        <span className="hidden md:block">{user.role === 'ADMIN' ? 'Admin' : 'Mis Ventas'}</span>
                                    </Link>
                                )}

                                <div className="h-6 w-px bg-gray-200 mx-2" />
                                
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
