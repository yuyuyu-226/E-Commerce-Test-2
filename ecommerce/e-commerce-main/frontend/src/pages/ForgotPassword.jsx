import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!API_BASE_URL) {
      console.warn('VITE_API_URL is missing in .env file');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('If an account exists for this email, a reset link has been sent.');
      } else {
        // Return success message to avoid exposing user presence
        setMessage('If an account exists for this email, a reset link has been sent.');
      }
    } catch {
      setMessage('If an account exists for this email, a reset link has been sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-light-accent)' }}>
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 md:p-10">
        <button
          onClick={() => navigate('/login')}
          id="backToLoginButtonFP"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </button>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the email associated with your account and we’ll send a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative mb-3">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="forgotEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 text-white font-semibold rounded-full bg-green-600 hover:bg-green-700 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center">
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
