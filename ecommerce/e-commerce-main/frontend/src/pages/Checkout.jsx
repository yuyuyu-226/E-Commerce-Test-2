import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  CreditCard, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { AuthContext } from '../components/AuthContext.jsx';

// Ensure you have these images or replace with Lucide icons if preferred
import GcashLogo from '../assets/gcash.svg'; 
import CreditCardLogo from '../assets/credit-card.svg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Destructure state passed from the Product Details page
    const { product, quantity, address, totalAmount } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 1. Safety Check: If user refreshes page, state is lost. Redirect to products.
    useEffect(() => {
        if (!location.state || !product) {
            navigate('/products');
        }
    }, [location.state, product, navigate]);

    // Prevent rendering if redirecting
    if (!product) return null;

    const handleSubmitOrder = async () => {
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');

        if (!token) {
            setError("You must be logged in to place an order.");
            setIsLoading(false);
            return;
        }

        // Robust ID check
        const realUserId = user?.id || user?._id; 
        if (!realUserId) {
            setError("User session invalid. Please login again.");
            setIsLoading(false);
            return;
        }

        try {
            const orderData = {
                userId: realUserId,
                productId: product._id,
                quantity: quantity,
                address: address,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod // Good practice to save this to DB too
            };

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Session expired. Please login again.");
                }
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create order.");
            }

            // Success state
            setSuccess(true);
            setTimeout(() => {
                navigate('/products'); 
            }, 3000); // Redirect after 3 seconds so user sees success message

        } catch (err) {
            console.error("Order creation error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for payment card styling
    const getPaymentCardStyle = (method) => {
        const isSelected = paymentMethod === method;
        return `relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
            isSelected 
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`;
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for your purchase. Your order for <strong>{product.name}</strong> has been placed successfully.
                    </p>
                    <p className="text-sm text-gray-400">Redirecting you to products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-light-accent)' }}>
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 mr-3 text-green-600" />
                        Secure Checkout
                    </h1>
                    <p className="mt-2 text-gray-600">Complete your purchase safely and securely.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Shipping & Payment */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Shipping Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Shipping Information
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                <Truck className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Delivery Address</p>
                                    <p className="text-gray-800 mt-1">{address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                Payment Method
                            </h2>
                            
                            <div className="space-y-4">
                                {/* GCash Option */}
                                <div 
                                    className={getPaymentCardStyle('gcash')}
                                    onClick={() => setPaymentMethod('gcash')}
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                                        {/* Fallback to icon if image fails or isn't imported */}
                                        <img src={GcashLogo} alt="GCash" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
                                        <Smartphone className="w-6 h-6 text-blue-500 hidden" style={{ display: 'none' }} /> 
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">GCash</span>
                                        <span className="text-sm text-gray-500">Pay securely using your GCash wallet</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'gcash' ? 'border-blue-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'gcash' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                </div>

                                {/* Credit Card Option */}
                                <div 
                                    className={getPaymentCardStyle('creditcard')}
                                    onClick={() => setPaymentMethod('creditcard')}
                                >
                                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                                        <img src={CreditCardLogo} alt="Card" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
                                        <CreditCard className="w-6 h-6 text-purple-600 hidden" style={{ display: 'none' }} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                                        <span className="text-sm text-gray-500">Visa, Mastercard, or Amex</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'creditcard' ? 'border-blue-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'creditcard' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                                Order Summary
                            </h2>

                            {/* Product Item */}
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-sm text-gray-500">Qty: {quantity}</span>
                                        <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Calculations */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${(product.price * quantity).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isLoading || !paymentMethod}
                                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform flex items-center justify-center ${
                                    isLoading || !paymentMethod
                                        ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm & Pay'
                                )}
                            </button>
                            
                            <p className="mt-4 text-xs text-center text-gray-400">
                                By placing this order, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;