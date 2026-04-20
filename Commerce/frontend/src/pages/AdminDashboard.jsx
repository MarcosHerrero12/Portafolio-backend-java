import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Plus, Edit, Trash2, X, Save, Search, Image as ImageIcon, Upload, Loader2, BarChart as ChartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import SellerStats from '../components/SellerStats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [activeTab, setActiveTab] = useState(user.role === 'SELLER' ? 'analytics' : 'products');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
    if (user.role === 'ADMIN') {
        fetchPendingSellers();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSellers = async () => {
    try {
        const response = await api.get('/admin/sellers/pending');
        setPendingSellers(response.data);
    } catch (err) {
        toast.error('Error al cargar solicitudes de vendedores');
    }
  };

  const handleApproveSeller = async (id) => {
    try {
        await api.post(`/admin/sellers/${id}/approve`);
        toast.success('Vendedor aprobado correctamente');
        fetchPendingSellers();
    } catch (err) {
        toast.error('Error al aprobar vendedor');
    }
  };

  const handleRejectSeller = async (id) => {
    if (window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
        try {
            await api.post(`/admin/sellers/${id}/reject`);
            toast.success('Solicitud rechazada');
            fetchPendingSellers();
        } catch (err) {
            toast.error('Error al rechazar');
        }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: response.data.url });
      toast.success('Imagen subida correctamente');
    } catch (err) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        categoryId: product.category?.id || ''
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: categories[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category: { id: formData.categoryId }
    };

    try {
      if (currentProduct) {
        await api.put(`/admin/products/${currentProduct.id}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Producto creado');
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/admin/categories', categoryFormData);
        toast.success('Categoría creada');
        setCategoryFormData({ name: '', description: '' });
        setIsCategoryModalOpen(false);
        fetchData();
    } catch (err) {
        toast.error('Error al crear categoría');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {user.role === 'ADMIN' ? 'Panel Administrativo' : 'Gestión de Ventas'}
          </h1>
          <p className="text-gray-500 mt-1">
            {user.role === 'ADMIN' 
              ? 'Administra productos, categorías y solicitudes de vendedores.' 
              : 'Publica productos y gestiona tu stock comercial.'}
          </p>
        </div>
        
        {activeTab === 'products' && (
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              Añadir Producto
            </button>
        )}

        {activeTab === 'categories' && (
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              Nueva Categoría
            </button>
        )}
      </div>

      {/* Selector de Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-px">
        {user.role === 'SELLER' && (
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <ChartIcon className="w-4 h-4" />
                Analíticas de Venta
            </button>
        )}
        
        <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <Package className="w-4 h-4" />
            Catálogo de Productos
        </button>

        {user.role === 'ADMIN' && (
            <>
                <button 
                    onClick={() => setActiveTab('sellers')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 relative flex items-center gap-2 ${activeTab === 'sellers' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Solicitudes
                    {pendingSellers.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                            {pendingSellers.length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Categorías
                </button>
            </>
        )}
      </div>

      {activeTab === 'analytics' && <SellerStats />}

      {/* Aviso para vendedores pendientes */}
      {user.role === 'SELLER' && user.sellerStatus === 'PENDING' && activeTab !== 'analytics' && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
            </div>
            <div>
                <h3 className="font-bold text-amber-900">Tu cuenta de vendedor está en revisión</h3>
                <p className="text-amber-700 text-sm mt-1">El administrador debe aprobar tu solicitud antes de que puedas publicar productos. Esto suele tardar menos de 24 horas.</p>
            </div>
          </div>
      )}

      {activeTab === 'products' ? (
        <>
          {/* Barra de Búsqueda */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en el inventario..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabla de Productos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                    {user.role === 'ADMIN' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendedor</th>}
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                                src={product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" }}
                            />
                          </div>
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                          {product.category?.name}
                        </span>
                      </td>
                      {user.role === 'ADMIN' && (
                        <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{product.seller?.companyName || 'Sistema'}</span>
                        </td>
                      )}
                      <td className="px-6 py-4 font-bold text-gray-900">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm font-medium">{product.stock} un.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            disabled={user.role === 'SELLER' && user.sellerStatus !== 'APPROVED'}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === 'sellers' ? (
        /* Tabla de Vendedores Pendientes (Solo Admin) */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {pendingSellers.length === 0 ? (
                <div className="p-10 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-bold">No hay solicitudes pendientes</h3>
                    <p className="text-gray-500 text-sm mt-1">Todas las solicitudes de empresa han sido procesadas.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa / Razón Social</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Fiscal</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingSellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{seller.companyName}</span>
                                            <span className="text-xs text-gray-500">{seller.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="text-gray-900">{seller.name}</span>
                                            <span className="text-gray-500">{seller.email}</span>
                                            <span className="text-gray-500">{seller.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                                            {seller.taxId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleApproveSeller(seller.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => handleRejectSeller(seller.id)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      ) : (
        /* Tabla de Categorías (Solo Admin) */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-500">{cat.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Imagen del Producto</label>
                <div className="mt-1 flex flex-col items-center gap-4">
                  {formData.imageUrl ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img 
                        src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:8080${formData.imageUrl}`} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, imageUrl: ''})}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                      {uploading ? (
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 mb-2" />
                          <span className="text-sm font-bold text-gray-500 group-hover:text-indigo-600">Subir imagen</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG hasta 5MB</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe las características principales..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  <Save className="w-5 h-5" />
                  {currentProduct ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Nueva Categoría</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                  placeholder="Ej: Calzado, Hogar..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
