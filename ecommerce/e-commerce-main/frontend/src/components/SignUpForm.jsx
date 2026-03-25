import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, CheckCircle, AlertTriangle, Loader, UserPlus } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom'; // Uncomment if using React Router for redirects

// --- Configuration (Option B: Best Practice) ---
// 1. Get the ROOT URL from the environment variable (e.g., https://your-backend.vercel.app)
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth`;

// Basic email format validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: at least 8 characters, one uppercase, one lowercase, one number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const SignUpForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false); 

  // Debug check
  useEffect(() => {
    if (!API_BASE_URL) {
      console.warn("VITE_API_URL is missing in your .env file.");
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (submitMessage) setSubmitMessage('');
  };

  // Validation logic
  const validate = (data) => {
    let newErrors = {};
    if (!data.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!data.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!data.username.trim()) newErrors.username = 'Username is required.';
    else if (data.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters.';
    
    if (!data.email.trim()) newErrors.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(data.email)) newErrors.email = 'Invalid email format.';
    
    if (!data.password) newErrors.password = 'Password is required.';
    else if (!PASSWORD_REGEX.test(data.password)) newErrors.password = 'Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number.';
    
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setShouldRedirect(false);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const { username, email, password, firstName, lastName } = formData;

      try {
        setIsSubmitting(true);
        setSubmitMessage('Creating account...');

        // --- OPTION B IMPLEMENTATION ---
        // Construct the full URL here by combining the Root URL + Specific Endpoint
        const url = `${API_BASE_URL}/auth/signup`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName, 
            last_name: lastName    
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Signup successful:', data);
          setSubmitMessage(`🎉 Signup successful! You will be redirected to login.`);
          setShouldRedirect(true);
        } else {
          setSubmitMessage(`🚫 Signup Failed: ${data.message || 'An unknown server error occurred.'}`);
        }

      } catch (error) {
        console.error('Fetch Error:', error);
        setSubmitMessage('🚫 Network error. Please check your connection.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitMessage('🚫 Please review the form errors.');
    }
  };
  
  // Effect for handling redirection
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        window.location.href = '/login'; 
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect]);
    
  // Helper for input classes
  const inputClass = (fieldName, hasIcon = true) => 
    `w-full p-3 rounded-xl outline-none transition-all duration-200 focus:ring-4 focus:ring-offset-2 shadow-sm ${hasIcon ? 'pl-10' : ''} ${
      errors[fieldName] 
        ? 'border-2 border-red-500 focus:border-red-600 focus:ring-red-200' 
        : 'border border-gray-300 focus:border-blue-600 focus:ring-blue-200'
    } text-[var(--color-primary-dark)]`;
  
  const iconBaseClass = "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none";

  return (
    <div className="w-full max-w-lg bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-center flex items-center justify-center" style={{ color: 'var(--color-primary-dark)' }}>
          <UserPlus className="w-8 h-8 mr-3" style={{ color: 'var(--color-primary-accent)' }} />
        Create Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name Fields */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-5 md:space-y-0">
          <div className="w-full">
            <label htmlFor="firstName" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>First Name</label>
            <input type="text" id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} className={inputClass('firstName', false)} />
            {errors.firstName && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.firstName}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>Last Name</label>
            <input type="text" id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} className={inputClass('lastName', false)} />
            {errors.lastName && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.lastName}</p>}
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>Username</label>
          <div className="relative">
            <User className={iconBaseClass} />
            <input type="text" id="username" name="username" placeholder="Choose a unique username" value={formData.username} onChange={handleChange} className={inputClass('username')} />
          </div>
          {errors.username && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>Email Address</label>
          <div className="relative">
            <Mail className={iconBaseClass} />
            <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={inputClass('email')} />
          </div>
          {errors.email && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.email}</p>}
        </div>
        
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>Password</label>
          <div className="relative">
            <Lock className={iconBaseClass} />
            <input type="password" id="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputClass('password')} />
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.password}</p>}
          {!errors.password && <small className="text-xs text-gray-500 mt-1 block">Min 8 chars, 1 uppercase, 1 lowercase, 1 number.</small>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-subtle)' }}>Confirm Password</label>
          <div className="relative">
            <Lock className={iconBaseClass} />
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={inputClass('confirmPassword')} />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600 mt-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <div className='pt-2'>
          <button 
            type="submit" 
            disabled={isSubmitting || shouldRedirect} 
            style={{ backgroundColor: 'var(--color-primary-accent)', color: 'var(--color-primary-dark)' }}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-full font-bold transition-all duration-300 transform hover:scale-[1.01] shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] ${
              isSubmitting || shouldRedirect ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isSubmitting ? (
              <><Loader className="w-5 h-5 mr-2 animate-spin" style={{ color: 'var(--color-primary-dark)' }} /> Processing...</>
            ) : shouldRedirect ? (
              'Redirecting...'
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
        
        {/* Messages */}
        {submitMessage && (
          <p className={`mt-4 p-3 rounded-xl text-center font-semibold flex items-center justify-center ${
            submitMessage.includes('successful') ? 'bg-[var(--color-light-accent)] text-[var(--color-primary-dark)]' : 'bg-red-100 text-red-700'
          }`}>
            {submitMessage.includes('successful') ? <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--color-primary-accent)' }} /> : <AlertTriangle className="w-5 h-5 mr-2" />}
            {submitMessage}
          </p>
        )}

        {/* Login Link */}
        <div className='text-center mt-6 pt-4 border-t border-gray-200'>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-bold hover:opacity-80 transition duration-150" style={{ color: 'var(--color-secondary-highlight)' }}>Log In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;