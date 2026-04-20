import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Award } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const SellerStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/seller/stats');
            setStats(response.data);
        } catch (err) {
            toast.error('Error al cargar analíticas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!stats) return null;

    const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                            <h3 className="text-2xl font-black text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.totalSales}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
                            <h3 className="text-2xl font-black text-gray-900">
                                ${stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales).toFixed(2) : 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tasa de Conversión</p>
                            <h3 className="text-2xl font-black text-gray-900">4.2%</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Ingresos Diarios */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Ingresos Diarios</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyRevenue}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    itemStyle={{color: '#4f46e5', fontWeight: 'bold'}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Top Productos */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Productos Más Vendidos</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#475569', fontSize: 11, fontWeight: 'bold'}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="quantity" radius={[0, 10, 10, 0]} barSize={25}>
                                    {stats.topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerStats;
