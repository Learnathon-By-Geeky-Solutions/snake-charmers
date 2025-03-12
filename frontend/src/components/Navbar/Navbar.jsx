import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/Logo2.png';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../../store/slices/user-slice';
// Icons for user roles
import { FaAmbulance, FaUser } from 'react-icons/fa'; // Using ambulance icon instead of car

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, name } = useSelector(state => state.user);
  const isLoggedIn = role !== '';
  const isDriver = role === 'driver';
  const isRider = role === 'rider';
  
  const handleLogout = () => {
    dispatch(deleteUser());
    navigate('/')
  };

  // Function to render the appropriate icon based on role with increased size
  const getRoleIcon = () => {
    if (isDriver) {
      return <FaAmbulance className="text-red-400 mr-2 text-lg" size={25} />; // Larger red ambulance icon
    } else if (isRider) {
      return <FaUser className="text-blue-400 mr-2 text-lg" size={20} />; // Larger blue user icon
    }
    return null;
  };

  return (
    <div className="navbar bg-black shadow-md p-4 h-20">
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
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Life Ride Logo" 
            className="h-16 w-17 max-h-full object-fill scale-110"
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white">
          <li><Link to="/">Home</Link></li>
          
          {/* Show "Request Ride" only for riders or when not logged in */}
          {(!isLoggedIn || isRider) && (
            <li>
              <Link to="/ride_request">Request Ride</Link>
            </li>
          )}
          
          {/* Show "Available Ride" only for drivers or when not logged in */}
          {(!isLoggedIn || isDriver) && (
            <li>
              <Link to="/available_ride">Available Ride</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end flex gap-2">
        {isLoggedIn ? (
          <>
            <div className="flex items-center mr-2 bg-gray-800 px-3 py-2 rounded-lg">
              {getRoleIcon()}
              <span className="text-white font-medium text-base">
                {name || `${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="btn bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;