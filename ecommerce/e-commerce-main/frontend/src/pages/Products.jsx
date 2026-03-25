import React, { useState, useEffect, useRef } from 'react';
import { Image, ShoppingCart, AlertTriangle, Search, Filter, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCardSkeleton from '../components/ProductCardSkeleton.jsx'; // Import the skeleton


// Base URL for your Express backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Product Card Component ---
const ProductCard = ({ product }) => {
    const navigate = useNavigate(); 
    
    const imageUrl = product.image_url || null; 

    // Initialize with the URL from the database
    const [imageSrc, setImageSrc] = useState(imageUrl);

    // Helper to handle navigation to the detail page
    const handleClick = () => {
        const id = product._id.$oid || product._id;
        navigate(`/product-details/${id}`);
    };

    // Fallback function for broken images
    const handleImageError = () => {
        setImageSrc("https://placehold.co/400x300/e0e0e0/555555?text=No+Image");
    };

    return (
        <div 
            className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 cursor-pointer"
            onClick={handleClick} 
        >
            
            {/* Image Display with Zoom Effect */}
            <div className="h-48 flex items-center justify-center relative bg-gray-50 overflow-hidden">
                {imageSrc && imageSrc !== "https://placehold.co/400x300/e0e0e0/555555?text=No+Image" ? (
                    <img 
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        onError={handleImageError}
                    />
                ) : (
                    <Image className="w-12 h-12 transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--color-secondary-subtle)' }} />
                )}
            </div>

            {/* Product Details */}
            <div className="p-5">
                <h3 className="text-lg font-bold mb-2 truncate transition-colors duration-300 group-hover:text-blue-600" style={{ color: 'var(--color-primary-dark)' }}>
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 h-12 mb-4">
                    {product.description}
                </p>
                
                {/* Price and Button */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xl font-extrabold" style={{ color: 'var(--color-secondary-highlight)' }}>
                        ${product.price ? product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2, }) : "N/A"}
                    </span>
                    
                    {/* ANIMATED BUTTON */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card click when clicking the button
                            handleClick();
                        }}
                        className="flex items-center text-[var(--color-primary-dark)] px-5 py-2.5 rounded-full text-sm font-bold shadow-md 
                        transform transition-all duration-200 ease-out
                        hover:scale-105 hover:shadow-lg hover:brightness-110
                        active:scale-95 active:shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary-accent)' }}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Product Page Component ---
const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [sortBy, setSortBy] = useState(''); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for custom dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Helper function to extract and clean categories
    const extractCategories = (data) => {
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        return uniqueCategories
          .filter(c => c && c.trim() !== '')
          .sort();
    };

    // 1. Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Wait for 1000ms (1 second) before proceeding with the fetch so skeleton is visible
                await new Promise(resolve => setTimeout(resolve, 1000));

                const params = new URLSearchParams();
                if (selectedCategory) params.append('category', selectedCategory);
                if (sortBy) params.append('sort', sortBy);
                if (searchQuery.trim()) params.append('query', searchQuery.trim());
                
                const queryString = params.toString();
                const url = `${API_BASE_URL}/products/getProducts${queryString ? `?${queryString}` : ''}`;
                  
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
                
                if (!selectedCategory && !searchQuery && categories.length === 0) {
                    setCategories(extractCategories(data));
                }
                if (categories.length === 0 && data.length > 0) {
                    setCategories(extractCategories(data));
                }

            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products. Please check the backend server and network connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, sortBy, searchQuery, categories.length]); 

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const renderContent = () => {
        // --- SKELETON LOADING STATE ---
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-12">
                    {/* Render 6 skeleton cards as placeholders */}
                    {[...Array(6)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-10 bg-red-50 rounded-xl shadow-sm border border-red-100">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-600" />
                    <p className="text-red-700 font-semibold text-lg">{error}</p>
                </div>
            );
        }
        
        if (products.length === 0) {
            return (
                <div className="text-center p-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 font-medium text-lg">No products found matching your criteria.</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedCategory('');}}
                        className="mt-4 text-blue-600 hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-12">
                {products.map(product => (
                    <ProductCard key={product._id.$oid || product._id} product={product} /> 
                ))}
            </div>
        );
    };

    // --- Shared Input Styles for Animations ---
    const inputTransitionClass = "w-full p-3 border rounded-xl shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent hover:shadow-md";

    return (
        <div className="min-h-screen flex font-inter" style={{ backgroundColor: 'var(--color-light-accent)' }}>
            
            {/* Sidebar */}
            <aside 
                className="w-72 p-8 shadow-2xl hidden md:block border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto" 
                style={{ backgroundColor: 'var(--color-secondary-subtle)' }}
            >
                <div className="mb-8 flex items-center space-x-2">
                    <Filter className="w-5 h-5" style={{ color: 'var(--color-primary-dark)' }}/>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
                        Filters
                    </h2>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Search</label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-300 group-hover:text-blue-600">
                            <Search className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`${inputTransitionClass} pl-10 bg-white`}
                            style={{ borderColor: 'var(--color-primary-dark)' }}
                        />
                    </div>
                </div>
                
                {/* Custom Animated Category Dropdown */}
                <div className="mb-6" ref={dropdownRef}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
                    <div className="relative">
                        {/* Trigger Button */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full p-3 bg-white border rounded-xl shadow-sm flex justify-between items-center text-left transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] ${isDropdownOpen ? 'ring-2 ring-[var(--color-primary-accent)] border-transparent' : ''}`}
                            style={{ borderColor: 'var(--color-primary-dark)' }}
                        >
                            <span className={`${!selectedCategory ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                                {selectedCategory || "All Categories"}
                            </span>
                            <ChevronDown 
                                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`} 
                            />
                        </button>

                        {/* Dropdown Menu with smooth transition */}
                        <div 
                            className={`absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out origin-top transform ${
                                isDropdownOpen 
                                    ? 'opacity-100 scale-y-100 max-h-60' 
                                    : 'opacity-0 scale-y-95 max-h-0 pointer-events-none'
                            }`}
                        >
                            <div className="overflow-y-auto max-h-60">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between ${selectedCategory === '' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                                >
                                    All Categories
                                    {selectedCategory === '' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between border-t border-gray-50 ${selectedCategory === category ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                                    >
                                        {category}
                                        {selectedCategory === category && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12 overflow-hidden">
                
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-end md:items-center border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-light tracking-tight mb-2" style={{ color: 'var(--color-primary-dark)' }}>
                            Our Products
                        </h1>
                        <p className="text-gray-500">Browse our latest collection.</p>
                    </div>
                    
                    {/* Sort Dropdown */}
                    <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white p-1 rounded-lg">
                        <label htmlFor="sort" className="text-sm font-semibold whitespace-nowrap px-2" style={{ color: 'var(--color-primary-dark)' }}>
                            Sort by:
                        </label>
                        <div className="relative">
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-2 pr-8 bg-transparent border-none font-medium text-gray-700 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                            >
                                <option value="">Recommended</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                {renderContent()}
                
            </main>
        </div>
    );
};

export default ProductPage;