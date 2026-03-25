import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Search, Loader2, AlertCircle, X, Save, Lock, ImageOff, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BASE_URL = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/$/, '') : '';

const API_BASE_URL = BASE_URL ? `${BASE_URL}/admin/products` : '';

console.log("Admin Dashboard API URL:", API_BASE_URL);

// --- Helper Functions ---
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch  {
        return null;
    }
};

// --- Reusable Modal Styles ---
const modalOverlayClass = "fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";
const modalContentClass = "bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100";

// --- Delete Confirmation Modal ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null;

    return (
        <div className={modalOverlayClass}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                    <p className="text-gray-500 mb-6">
                        Are you sure you want to delete <span className="font-bold text-gray-800">"{productName}"</span>? 
                        This action cannot be undone.
                    </p>
                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Add/Edit Form Component (Reusable) ---
const ProductForm = ({ initialData, onSubmit, onClose, title, isSaving, saveError }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-150";

    return (
        <div className={modalOverlayClass}>
            <div className={modalContentClass}>
                {/* 1. Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* 2. Scrollable Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="product-form" onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-24`} />
                        </div>

                        {/* Price and Stock */}
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} min="0.01" step="0.01" required />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={inputClass} min="0" required />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className={inputClass} />
                        </div>

                        {/* Error Message */}
                        {saveError && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                                <AlertCircle className="w-4 h-4 mr-2" /> {saveError}
                            </div>
                        )}
                    </form>
                </div>

                {/* 3. Fixed Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        form="product-form"
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Saving...</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Edit Product Modal Wrapper ---
const EditProductModal = ({ product, onClose, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const handleSubmit = async (e, formData) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        try {
            const token = localStorage.getItem('token');
            // FIX: Ensure API_BASE_URL is valid before fetching
            if (!API_BASE_URL) throw new Error("Server URL is missing. Check .env file.");

            const response = await fetch(`${API_BASE_URL}/edit/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            const updatedProduct = await response.json();
            onSave(updatedProduct);
            onClose();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!product) return null;

    return (
        <ProductForm 
            title={`Edit Product: ${product.name}`}
            initialData={{
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                image_url: product.image_url,
            }}
            onSubmit={handleSubmit}
            onClose={onClose}
            isSaving={isSaving}
            saveError={saveError}
        />
    );
};

// --- Add Product Modal Wrapper ---
const AddProductModal = ({ onClose, onAdd }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const initialData = {
        name: '', description: '', price: 0, stock: 0, category: '', image_url: ''
    };

    const handleSubmit = async (e, formData) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        try {
            const token = localStorage.getItem('token');
            // FIX: Ensure API_BASE_URL is valid before fetching
            if (!API_BASE_URL) throw new Error("Server URL is missing. Check .env file.");

            const response = await fetch(`${API_BASE_URL}/add`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create product");
            }

            const newProduct = await response.json();
            onAdd(newProduct);
            onClose();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ProductForm 
            title="Add New Product"
            initialData={initialData}
            onSubmit={handleSubmit}
            onClose={onClose}
            isSaving={isSaving}
            saveError={saveError}
        />
    );
};

// --- Admin Dashboard Main Component ---
const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal States
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
    
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // 1. Initial Auth Check and Data Fetch
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Not logged in. Redirecting to login.");
            setTimeout(() => navigate('/login'), 1500);
            setIsLoading(false);
            return;
        }
        try {
            // Using manual parseJwt instead of jwt-decode library
            const decoded = parseJwt(token);
            if (decoded && decoded.role === 'Admin') {
                setIsAdmin(true);
                fetchProducts(token);
            } else {
                setIsAdmin(false);
                setIsLoading(false);
            }
        } catch  {
            setError("Invalid token. Redirecting to login.");
            localStorage.removeItem('token');
            setTimeout(() => navigate('/login'), 1500);
            setIsLoading(false);
        }
    }, [navigate]);

    const fetchProducts = async (token) => {
        setIsLoading(true);
        setError(null);
        try {
            // FIX: This check now works correctly because API_BASE_URL is empty string if env is missing
            if (!API_BASE_URL) throw new Error("VITE_API_URL is missing in environment variables.");

            const response = await fetch(`${API_BASE_URL}/getAllProducts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401 || response.status === 403) throw new Error('Authorization Failed.');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch (err) {
            setError(`Failed to load data: ${err.message}`);
            if (err.message.includes('Authorization Failed')) {
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login'), 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Handle Delete (Updated to use Modal)
    const confirmDelete = async () => {
        const id = deleteModal.productId;
        if (!id) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setProducts(products.filter(product => product._id !== id));
                setDeleteModal({ isOpen: false, productId: null, productName: '' });
            } else {
                console.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Open Delete Modal
    const openDeleteModal = (product) => {
        setDeleteModal({
            isOpen: true,
            productId: product._id,
            productName: product.name
        });
    };

    const handleProductUpdate = (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleProductAdd = (newProduct) => {
        setProducts(prev => [...prev, newProduct]);
    };

    const filteredProducts = products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (stock) => {
        const stockNum = stock || 0;
        if (stockNum <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100', weight: 'font-bold' };
        if (stockNum < 10) return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100', weight: 'font-semibold' };
        return { text: stockNum, color: 'text-green-700', bg: 'bg-green-100', weight: 'font-medium' };
    };

    // Access Denied
    if (!isAdmin && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center" style={{ backgroundColor: 'var(--color-light-accent)' }}>
                <div className="bg-white p-10 rounded-2xl shadow-xl border-t-4 border-red-500 max-w-md">
                    <Lock className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition">Go to Home Page</Link>
                </div>
            </div>
        );
    }

    const ProductImage = ({ src, alt }) => {
        const [imgSrc, setImgSrc] = useState(src);
        const [error, setError] = useState(false);
        useEffect(() => { setImgSrc(src); setError(false); }, [src]);
        if (error || !imgSrc) return <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"><ImageOff className="w-8 h-8" /></div>;
        return <img src={imgSrc} alt={alt} className="w-16 h-16 object-cover rounded-md shadow-sm" onError={() => setError(true)} />;
    };

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-light-accent)' }}>
            
            {/* Edit Modal */}
            {editingProduct && (
                <EditProductModal 
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)} 
                    onSave={handleProductUpdate}                  
                />
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <AddProductModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleProductAdd}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal 
                isOpen={deleteModal.isOpen}
                productName={deleteModal.productName}
                onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                onConfirm={confirmDelete}
            />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center text-gray-900">
                        <Shield className="w-8 h-8 mr-3 text-green-600" />
                        Product Management
                    </h1>
                    <p className="text-gray-600 mt-1">View and manage your store inventory.</p>
                </div>
                
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition transform hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading inventory...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                        <AlertCircle className="w-10 h-10 mb-4" />
                        <p>Error: {error}</p>
                        <button onClick={() => fetchProducts(localStorage.getItem('token'))} className="mt-4 text-blue-600 underline">Try Again</button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>No products found. Click "Add New Product" to start.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                    <th className="p-4 border-b w-16 text-center">#</th>
                                    <th className="p-4 border-b">Image</th>
                                    <th className="p-4 border-b">Product Name</th>
                                    <th className="p-4 border-b">Category</th>
                                    <th className="p-4 border-b">Price</th>
                                    <th className="p-4 border-b">Stock</th>
                                    <th className="p-4 border-b text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product, index) => {
                                    const stockStatus = getStockStatus(product.stock);
                                    return (
                                        <tr key={product._id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="p-4 text-center text-sm text-gray-500 font-medium">{index + 1}</td>
                                            <td className="p-2"><ProductImage src={product.image_url} alt={product.name} /></td>
                                            <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="p-4 text-gray-600"><span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{product.category || 'Uncategorized'}</span></td>
                                            <td className="p-4 text-green-700 font-semibold">${product.price}</td>
                                            <td className={`p-4 ${stockStatus.weight}`}><span className={`px-2 py-1 text-xs rounded-full ${stockStatus.bg} ${stockStatus.color}`}>{stockStatus.text}</span></td>
                                            <td className="p-4 flex justify-center space-x-4">
                                                <button onClick={() => setEditingProduct(product)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition" title="Edit"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => openDeleteModal(product)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;