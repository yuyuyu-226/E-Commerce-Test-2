import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { ShoppingCart, Loader, AlertTriangle, Image as ImageIcon, ChevronDown, Tag, Box } from 'lucide-react';
import OrderConfirmationModal from '../components/OrderConfirmationModal.jsx';
import AuthRedirectModal from '../components/AuthRedirectModal.jsx'; 
import { FastAverageColor } from "fast-average-color"; 
import { AuthContext } from '../components/AuthContext.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetails = () => { 
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);
    const fac = useMemo(() => new FastAverageColor(), []);
    
    const { id } = useParams(); 
    const productId = id || '690e075d5058824ebdd932ab'; 

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);       
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [avgColor, setAvgColor] = useState('#f5f5f5'); 
    
    // State for the Category Dropdown animation
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);

    const handleImageError = () => {
        setImageSrc("https://placehold.co/500x500/e0e0e0/555555?text=Product+Image+Error");
    };

    const handleConfirmOrder = ({ quantity, address, totalAmount }) => {
        navigate('/checkout', { 
            state: { 
                product, 
                quantity, 
                address, 
                totalAmount,
                userId: user?.id || user?._id || 'mockUserId' 
            } 
        });
    };

    const handleOrderClick = () => {
        if (product.stock === 0) return;

        if (isLoggedIn) {
            setIsModalOpen(true);
            setIsAuthModalOpen(false);
        } else {
            setIsAuthModalOpen(true);
            setIsModalOpen(false);
        }
    };

    const extractAverageColor = useCallback((imageElement) => {
        try {
            const color = fac.getColor(imageElement, { mode: "speed" }); 
            setAvgColor(color.hex);
        } catch (err) {
            console.error("Failed to get average color:", err);
            setAvgColor('#f5f5f5');
        }
    }, [fac]);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProduct(null);
        setAvgColor('#f5f5f5');
        
        if (!productId || productId.length < 5) {
            setError("Invalid product identifier found in the URL.");
            setLoading(false);
            return;
        }
        
        try {
            const url = `${API_BASE_URL}/products/getProductById/${productId}`; 
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'No message available' }));
                if (response.status === 404) throw new Error(`Product not found (ID: ${productId})`);
                throw new Error(`API failed: ${response.status} - ${errorData.error}`);
            }
            
            const data = await response.json();
            if (!data || !data.name) throw new Error("Data retrieved successfully but product object is empty.");

            setProduct(data);
            setImageSrc(data.image_url || null); 
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.message || "Failed to load product details. Check network.");
        } finally {
            setLoading(false);
        }
    }, [productId]); 

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]); 

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-90" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
                <div className="flex items-center p-6 bg-white rounded-xl shadow-2xl animate-pulse">
                    <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary-accent)' }} />
                    <p className="ml-3 text-lg font-medium" style={{ color: 'var(--color-primary-dark)' }}>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center p-8" style={{ backgroundColor: 'var(--color-light-accent)' }}>
                <div className="text-center p-10 bg-red-50 rounded-2xl shadow-xl border border-red-100">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-red-600" />
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Product</h2>
                    <p className="text-red-600">{error}</p>
                    <button onClick={fetchProduct} className="mt-6 px-6 py-2 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors">Try Again</button>
                </div>
            </div>
        );
    }

    if (!product || !product.name) return null;

    return (
        <div className="min-h-screen p-6 lg:p-12 transition-colors duration-500" style={{ backgroundColor: 'var(--color-light-accent)' }}>
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-6 md:p-10 overflow-hidden">
                
                <div className="text-sm mb-8 flex items-center space-x-2" style={{ color: 'var(--color-secondary-highlight)' }}>
                    <Link to="/" className="hover:text-blue-600 hover:underline transition-all duration-200">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-blue-600 hover:underline transition-all duration-200">Products</Link>
                    <span>/</span>
                    <span className="font-semibold">{product.name}</span>
                </div>

                <div className="md:flex md:space-x-12">
                    
                    <div className="md:w-1/2 flex-shrink-0 mb-8 md:mb-0 group perspective-1000">
                        <div 
                            className="relative rounded-2xl overflow-hidden border-4 shadow-inner transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-xl"
                            style={{ 
                                borderColor: 'var(--color-secondary-subtle)', 
                                backgroundColor: avgColor,
                                width: '100%', 
                                paddingBottom: '100%'
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center p-6">
                                {imageSrc && imageSrc !== "https://placehold.co/500x500/e0e0e0/555555?text=Product+Image+Error" ? (
                                    <img 
                                        src={imageSrc}
                                        alt={product.name}
                                        className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                                        onError={handleImageError}
                                        onLoad={(e) => extractAverageColor(e.target)}
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <ImageIcon className="w-24 h-24 opacity-50" style={{ color: 'var(--color-secondary-subtle)' }} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 pt-2 flex flex-col">
                        
                        <div className="flex-grow">
                            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: 'var(--color-primary-dark)' }}>
                                {product.name}
                            </h1>
                            
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                {product.description}
                            </p>

                            <div className="mb-8 border rounded-xl overflow-hidden border-gray-200">
                                <button 
                                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <span className="font-bold text-gray-700 flex items-center">
                                        <Box className="w-4 h-4 mr-2" /> Product Specifications
                                    </span>
                                    <ChevronDown 
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSpecsOpen ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                
                                <div 
                                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isSpecsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-4 border-t border-gray-200 bg-white">
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-500 w-24 text-sm">Category:</span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {product.category || 'General Item'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-500 w-24 text-sm">ID:</span>
                                                <span className="text-gray-700 font-mono text-xs">{product._id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-6 flex items-baseline space-x-4">
                                <span className="text-5xl font-extrabold tracking-tight" style={{ color: 'var(--color-secondary-highlight)' }}>
                                    ${product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
                                </span>
                            </div>

                            <div className="text-sm font-semibold mb-8">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full transition-transform duration-300 hover:scale-105 ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                                </span>
                            </div>

                            <button
                                onClick={handleOrderClick}
                                disabled={product.stock === 0}
                                className={`
                                    w-full max-w-sm py-4 rounded-2xl text-xl font-bold text-white shadow-lg
                                    transform transition-all duration-300 ease-out
                                    ${product.stock > 0 
                                        ? 'hover:scale-[1.03] hover:shadow-2xl hover:brightness-110 active:scale-[0.97] active:shadow-sm cursor-pointer' 
                                        : 'opacity-50 cursor-not-allowed grayscale'
                                    }
                                `}
                                style={{ backgroundColor: 'var(--color-primary-dark)' }}
                            >
                                <span className="flex items-center justify-center">
                                    <ShoppingCart className={`w-6 h-6 mr-3 ${product.stock > 0 ? 'animate-bounce-slow' : ''}`} style={{ color: 'var(--color-primary-accent)' }} />
                                    {product.stock > 0 ? 'Order Now' : 'Unavailable'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <OrderConfirmationModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
            />
            
            <AuthRedirectModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};

export default ProductDetails;