import React, { useState, useContext } from 'react'; // 1. Import useContext
import { Home, ShoppingBag, Mail, Info, LogIn, LogOut, Menu, X, User as UserIcon, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; // 2. Import the context

// const navLinks = [
//   { name: 'Home', icon: Home, path: '/' },
//   { name: 'Products', icon: ShoppingBag, path: '/products' },
//   { name: 'Contact', icon: Mail, path: '/contact' },
//   { name: 'About', icon: Info, path: '/about' },
// ];

// 3. Remove props: isLoggedIn, user, onLogout
const NavBar = () => {
  // 4. Get auth state directly from context
  const { isLoggedIn, user, handleLogout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  // const navigate = useNavigate();

  // Handle the logout action
  const onLogoutClick = () => {
    handleLogout(); // Call the logout function from context
    setIsOpen(false); // Close mobile menu if open
  };

  // Common Tailwind classes
  const navBarClass = "flex items-center justify-between p-4 bg-gray-200 shadow-xl w-full sticky top-0 z-50 rounded-b-lg";
  const brandClass = "text-xl font-extrabold text-gray-900 mr-8 tracking-wider";
  
  const linkBaseClass = "flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 p-2 rounded-lg";
  const iconClass = "w-4 h-4 mr-2";

  const adminLinkClass = "flex items-center text-sm font-medium p-2 rounded-lg text-yellow-700 bg-yellow-200 hover:bg-yellow-300";
  
  const loginButtonClass = "flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-150 cursor-pointer";
  const logoutButtonClass = "flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-500 transition-colors duration-150 cursor-pointer";
  const loginIconClass = "w-4 h-4 mr-2 transform rotate-180";
  const logoutIconClass = "w-4 h-4 mr-2";

  return (
    <header className={navBarClass}>
      {/* Left Side: Brand Logo and Mobile Menu Button */}
      <div className="flex items-center">
        <Link to="/" className={brandClass}>
          MyBrand
        </Link>
        <button 
          className="md:hidden p-2 text-gray-700 hover:bg-gray-300 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Center: Desktop Navigation Links (hidden on mobile) */}
      <nav className="hidden md:flex flex-grow justify-center items-center space-x-4 lg:space-x-8">
        <Link to="/" className={linkBaseClass}>
          <Home className={iconClass} />
          Home
        </Link>
        
        <Link to="/products" id="productsLink" className={linkBaseClass}>
          <ShoppingBag className={iconClass} />
          Products
        </Link>
        
        <Link to="/contact" id="contactLink" className={linkBaseClass}>
          <Mail className={iconClass} />
          Contact
        </Link>
        
        <Link to="/about" id="aboutLink" className={linkBaseClass}>
          <Info className={iconClass} />
          About
        </Link>

        {isLoggedIn && user?.role === 'Admin' && (
          <Link to="/admin" className={adminLinkClass}>
            <Shield className={iconClass} />
            Admin
          </Link>
        )}
      </nav>

      {/* Right Side: Conditional Login/Logout Button */}
      <div className="ml-auto flex-shrink-0 flex items-center space-x-4">
        {isLoggedIn && user ? (
          // --- LOGGED IN STATE ---
          <>
            <span className="hidden sm:flex items-center text-sm font-medium text-gray-700">
              <UserIcon className="w-4 h-4 mr-2" />
              Welcome, {user.username || user.email}
            </span>
            <button className={logoutButtonClass} onClick={onLogoutClick}>
              <LogOut className={logoutIconClass} />
              Log Out
            </button>
          </>
        ) : (
          // --- LOGGED OUT STATE ---
          <Link to="/login"> 
            <button id="loginButton" className={loginButtonClass}>
              <LogIn className={loginIconClass} />
              Login / Sign Up
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <nav 
          id="mobile-menu"
          className="absolute inset-x-0 top-full bg-gray-100 shadow-xl md:hidden flex flex-col items-start p-4 space-y-2 rounded-b-lg animate-fade-in"
        >
          <Link
            to="/"
            className={`${linkBaseClass} w-full text-lg`}
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </Link>
          
          <Link
            to="/products"
            className={`${linkBaseClass} w-full text-lg`}
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Products
          </Link>
          
          <Link
            to="/contact"
            className={`${linkBaseClass} w-full text-lg`}
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-5 h-5 mr-3" />
            Contact
          </Link>
          
          <Link
            to="/about"
            className={`${linkBaseClass} w-full text-lg`}
            onClick={() => setIsOpen(false)}
          >
            <Info className="w-5 h-5 mr-3" />
            About
          </Link>

          {/* Also add welcome/logout to mobile menu */}
          {isLoggedIn && user?.role === 'Admin' && (
            <Link 
              to="/admin" 
              className={`${adminLinkClass} w-full text-lg`}
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-5 h-5 mr-3" />
              Admin Dashboard
            </Link>
          )}
          
          {isLoggedIn && user && (
            <div className="w-full pt-4 border-t border-gray-300">
              <span className="flex items-center text-lg font-medium text-gray-700 mb-4">
                <UserIcon className="w-5 h-5 mr-3" />
                Welcome, {user.username || user.email}
              </span>
              <button className={`${logoutButtonClass} w-full justify-center text-lg`} onClick={onLogoutClick}>
                <LogOut className={logoutIconClass} />
                Log Out
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Tailwind CSS keyframes for a smooth opening/closing effect */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default NavBar;