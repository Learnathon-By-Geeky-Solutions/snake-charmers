import { useState } from 'react';
import { useDispatch } from "react-redux";
import handleLogin from '../../controllers/Login';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState('User'); // Default role is "User"
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role}`);
    console.log('Phone or Email:', phoneOrEmail);
    console.log('Password:', password);
    handleLogin({
        phone_or_email: phoneOrEmail,
        password,
        user_type: (role === 'User' ? 'rider' : 'driver'),
      },
      dispatch,
      navigate
    )
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        {/* Role selection buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              role === 'User' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setRole('User')}
          >
            User
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              role === 'Driver' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setRole('Driver')}
          >
            Driver
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email/Mobile Field */}
          <div className="flex flex-col">
            <label 
              htmlFor="email"
              className="text-gray-700 text-sm font-medium mb-1"
            >
              Email or Mobile
            </label>
            <input
              id="email"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email or mobile"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-700 text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg shadow-md mt-6 font-medium text-white transition-all duration-300 ${
              role === 'User' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;