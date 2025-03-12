import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/Logo2.png';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../../store/slices/user-slice';
// import userSlice from '../../store/slices/user-slice';// Assuming you have a logout action

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, name } = useSelector(state => state.user); // Assuming auth state has role and username
  const isLoggedIn = role !== '';
  
  const handleLogout = () => {
    dispatch(deleteUser());
    navigate('/')
  };

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
            className="h-16 w-17 max-h-full object-fill scale-110" // Increased size without affecting navbar
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
        {isLoggedIn ? (
          <>
            <div className="flex items-center mr-2">
              <span className="text-white font-medium">
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