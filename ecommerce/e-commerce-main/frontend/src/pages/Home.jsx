import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Loader } from 'lucide-react';
import HeroImage from '../assets/heroSection.jpg'; // ✔ Correct asset import

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simplified image resolver
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://placehold.co/600x400/e0e0e0/555555?text=No+Image";
        if (imagePath.startsWith('http')) return imagePath;

        return `/images/${imagePath.replace(/^images\//, '').replace(/\\/g, '/')}`;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/getProducts`);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();
                const products = Array.isArray(data) ? data : data.products || [];

                const unique = {};

                products.forEach(product => {
                    if (!product.category) return;

                    if (!unique[product.category]) {
                        unique[product.category] = {
                            name: product.category,
                            image: product.image_url,
                            description: `Explore our latest ${product.category} collection.`
                        };
                    }
                });

                setCategories(Object.values(unique).slice(0, 3));
            } catch  {
                setError("Unable to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (name) => {
        navigate('/products', { state: { category: name } });
    };

    return (
        <div className="font-sans text-gray-800">

            {/* --- HERO SECTION (Uses LOCAL asset image) --- */}
            <section
                className="relative py-32 px-6 md:px-12 text-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HeroImage})` }} // ✔ Uses asset correctly
            >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                        Innovating Textile Manufacturing for Tomorrow's Fashion
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                        From concept to creation, we blend cutting-edge technology with timeless craftsmanship.
                    </p>
                    <Link
                        to="/products"
                        id="exploreProductsLink"
                        className="inline-flex items-center px-8 py-4 text-lg font-bold text-white rounded-lg shadow-lg hover:bg-opacity-90 transition-transform hover:-translate-y-1"
                        style={{ backgroundColor: 'var(--color-primary-accent)' }}
                    >
                        Explore Our Collections
                    </Link>
                </div>
            </section>

            {/* --- PRODUCT CATEGORIES --- */}
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16" style={{ color: 'var(--color-primary-dark)' }}>
                        Our Product Categories
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader className="w-10 h-10 animate-spin text-gray-400" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-gray-500">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categories.map((cat, index) => (
                                <div key={index} className="group bg-white border rounded-xl overflow-hidden shadow hover:shadow-2xl transition">
                                    <div className="h-64 overflow-hidden bg-gray-100">
                                        <img
                                            src={getImageUrl(cat.image)}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => (e.target.src = "https://placehold.co/600x400")}
                                        />
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-xl font-bold mb-3 capitalize">
                                            {cat.name}
                                        </h3>
                                        <p className="text-gray-600 mb-6">{cat.description}</p>

                                        <button
                                            onClick={() => handleCategoryClick(cat.name)}
                                            className="w-full py-3 rounded-lg text-white font-bold"
                                            style={{ backgroundColor: 'var(--color-primary-accent)' }}
                                        >
                                            View More <ArrowRight className="inline-block ml-2 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* --- MANUFACTURING PROCESS --- */}
            <section className="py-20 px-6 md:px-12" style={{ backgroundColor: 'var(--color-light-accent)' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Our Manufacturing Process & Capabilities
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="h-96 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1504279577054-acfeccf8dr52?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold uppercase mb-4">
                                Precision, Quality, and Innovation
                            </h3>

                            <ul className="space-y-4 mb-10">
                                {[
                                    "Fabric Sourcing & Inspection",
                                    "CAD Pattern Making",
                                    "Automated Cutting & Sewing",
                                    "Quality Control",
                                    "Sustainable Production"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mt-1 mr-3" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/about"
                                id='learnMoreLink'
                                className="px-6 py-3 font-semibold text-white rounded-lg"
                                style={{ backgroundColor: 'var(--color-primary-accent)' }}
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
