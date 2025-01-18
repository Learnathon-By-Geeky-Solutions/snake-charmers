import { Link } from "react-router-dom";
import logo from '../assets/images/websitelogofinal.png';

function Navbar() {
  return (
    <div>
      {/* Navbar Section */}
      <nav className="absolute top-0 left-0 w-full bg-light-green-1 p-4 z-20 h-16 flex items-center mb-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {/* Logo with text */}
            <img
              src={logo} // Add the logo here
              alt="Life Ride Logo"
              className="w-15 h-14 object-contain" // Adjust the size of the logo
            />
            <span className="text-white text-xl font-bold">Life Ride</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white px-4">Home</Link>
            <Link to="/services" className="text-white px-4">Services</Link>
            <Link to="/contact" className="text-white px-4">Contact</Link>
            <Link to="/signup">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
