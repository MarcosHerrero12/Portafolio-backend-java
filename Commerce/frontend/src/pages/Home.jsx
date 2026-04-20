import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader2, Search, Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, minPrice, maxPrice]);

    const fetchInitialData = async () => {
        try {
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
        } catch (err) {
            console.error('Error fetching categories');
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.name = searchTerm;
            if (selectedCategory) params.categoryId = selectedCategory;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            
            const response = await api.get('/products', { params });
            setProducts(response.data);
        } catch (err) {
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Calidad <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Premium</span> para tu Estilo
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Explora nuestra colección curada de tecnología y accesorios con diseño de vanguardia.
                </p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="¿Qué estás buscando hoy?"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-gray-700 appearance-none font-medium"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio</span>
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-20 bg-transparent border-none focus:ring-0 text-sm font-bold text-indigo-600 placeholder-gray-300"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <div className="w-2 h-px bg-gray-300" />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-20 bg-transparent border-none focus:ring-0 text-sm font-bold text-indigo-600 placeholder-gray-300"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                    <p className="text-gray-500 font-medium">Buscando productos...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                    <p className="text-gray-500">Prueba con otros términos de búsqueda o categorías.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
