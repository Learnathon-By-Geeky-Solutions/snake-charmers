import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/Logo2.png';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../../store/slices/user-slice';
import { FaAmbulance, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { role, name } = useSelector(state => state.user);
  const isLoggedIn = role !== '';
  const isDriver = role === 'driver';
  const isRider = role === 'rider';
  const isHomePage = location.pathname === '/';
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(deleteUser());
    navigate('/');
  };

  const getRoleIcon = () => {
    if (isDriver) {
      return <FaAmbulance className="text-red-500" size={18} />;
    } else if (isRider) {
      return <FaUser className="text-blue-500" size={18} />;
    }
    return null;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get nav link classes based on active state
  const getNavLinkClasses = (path) => {
    return `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
    ${isActive(path) 
      ? 'text-blue-600 bg-blue-50' 
      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
    }`;
  };

  // Get mobile nav link classes based on active state
  const getMobileNavLinkClasses = (path) => {
    return `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 
    ${isActive(path) 
      ? 'text-blue-600 bg-blue-50' 
      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
    }`;
  };

  // Get login button classes based on active state
  const getLoginButtonClasses = () => {
    return isActive('/login')
      ? "bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
      : "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
  };

  // Get signup button classes based on active state
  const getSignupButtonClasses = () => {
    return isActive('/signup')
      ? "bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
      : "bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
  };

  // Get mobile login button classes based on active state
  const getMobileLoginButtonClasses = () => {
    return isActive('/login')
      ? "w-full text-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg text-base font-medium shadow-md transition-colors duration-200"
      : "w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium shadow-sm transition-colors duration-200";
  };

  // Get mobile signup button classes based on active state
  const getMobileSignupButtonClasses = () => {
    return isActive('/signup')
      ? "w-full text-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg text-base font-medium shadow-md transition-colors duration-200"
      : "w-full text-center bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg text-base font-medium shadow-sm transition-colors duration-200";
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 
      ${scrolled 
        ? 'bg-white shadow-md backdrop-blur-lg' 
        : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src={logo} 
                alt="Life Ride Logo" 
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                LifeRide
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={getNavLinkClasses('/')}>
              Home
            </Link>
            
            {(!isLoggedIn || isRider) && (
              <Link to="/ride_request" className={getNavLinkClasses('/ride_request')}>
                Request Ambulance
              </Link>
            )}
            
            {(!isLoggedIn || isDriver) && (
              <Link to="/available_ride" className={getNavLinkClasses('/available_ride')}>
                Available Requests
              </Link>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center ml-6">
                <div className="flex items-center mr-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <span className="mr-2">{getRoleIcon()}</span>
                  <span className="text-gray-800 font-medium text-sm">{name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isHomePage && (
                <div className="flex items-center space-x-3 ml-6">
                  <Link to="/login">
                    <button className={getLoginButtonClasses()}>
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className={getSignupButtonClasses()}>
                      Sign Up
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
          <div className="px-4 pt-3 pb-5 space-y-2">
            <Link 
              to="/" 
              className={getMobileNavLinkClasses('/')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {(!isLoggedIn || isRider) && (
              <Link 
                to="/ride_request" 
                className={getMobileNavLinkClasses('/ride_request')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Request Ambulance
              </Link>
            )}
            
            {(!isLoggedIn || isDriver) && (
              <Link 
                to="/available_ride" 
                className={getMobileNavLinkClasses('/available_ride')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Available Requests
              </Link>
            )}
            
            {isLoggedIn ? (
              <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg shadow-sm">
                  <span className="mr-3">{getRoleIcon()}</span>
                  <span className="text-gray-800 font-medium">{name}</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-base font-medium shadow-sm transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isHomePage && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    to="/login" 
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className={getMobileLoginButtonClasses()}>
                      Login
                    </button>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className={getMobileSignupButtonClasses()}>
                      Sign Up
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;