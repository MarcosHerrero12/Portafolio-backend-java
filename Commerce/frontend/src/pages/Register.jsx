import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, AlertCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const [isSeller, setIsSeller] = useState(false);
    const [sellerData, setSellerData] = useState({
        companyName: '',
        taxId: '',
        address: '',
        phoneNumber: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password, isSeller, sellerData);
            navigate('/');
        } catch (err) {
            setError('Error en el registro. Por favor intente de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Package className="h-12 w-12 text-indigo-600 mx-auto" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Crea tu cuenta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Inicia sesión
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 bg-red-50 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Selector de tipo de cuenta */}
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSeller ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                onClick={() => setIsSeller(false)}
                            >
                                Comprador
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSeller ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                onClick={() => setIsSeller(true)}
                            >
                                Vendedor / Empresa
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {isSeller && (
                            <div className="space-y-5 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-wider">Datos de la Empresa</h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        required
                                        value={sellerData.companyName}
                                        onChange={(e) => setSellerData({...sellerData, companyName: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">ID Fiscal (RUC/CUIT/NIT)</label>
                                    <input
                                        type="text"
                                        required
                                        value={sellerData.taxId}
                                        onChange={(e) => setSellerData({...sellerData, taxId: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Dirección Comercial</label>
                                    <input
                                        type="text"
                                        required
                                        value={sellerData.address}
                                        onChange={(e) => setSellerData({...sellerData, address: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono de Contacto</label>
                                    <input
                                        type="text"
                                        required
                                        value={sellerData.phoneNumber}
                                        onChange={(e) => setSellerData({...sellerData, phoneNumber: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                {isLoading ? 'Procesando...' : (isSeller ? 'Registrar como Vendedor' : 'Crear mi Cuenta')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
