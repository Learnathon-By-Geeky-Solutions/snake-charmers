import { Link } from 'react-router-dom';
import logo from '../../assets/images/ambulancelogo1.png';

function Navbar() {
  return (
    <div className="navbar bg-black shadow-md p-4 h-20"> {/* Fixed navbar height */}
      <div className="navbar-start">
        <div className="dropdown">
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-light-green-1 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><Link to="/">Home</Link></li>
            <li>
              <details>
                <summary>Services</summary>
                <ul className="p-2">
                  <li><Link to="/services">Our Services</Link></li>
                </ul>
              </details>
            </li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        {/* Slightly increased logo size without affecting navbar */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Life Ride Logo" 
            className="h-12 w-13 max-h-full object-contain scale-110" // Increased size without affecting navbar
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white">
          <li><Link to="/">Home</Link></li>
          <li>
            <Link to="/ride_request">Request Ride</Link>
          </li>
          <li><Link to="/available_ride">Available Ride</Link></li>
        </ul>
      </div>
      <div className="navbar-end flex gap-2">
        <Link to="/signup">
          <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className="btn bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
