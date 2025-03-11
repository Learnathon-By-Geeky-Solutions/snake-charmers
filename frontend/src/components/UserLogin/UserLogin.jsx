import { useState } from 'react';
import { useDispatch } from "react-redux";
import handleLogin from '../../controllers/Login';

function UserLogin() {
  const dispatch = useDispatch();
  const [role, setRole] = useState('User'); // Default role is "User"
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(role);
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
      dispatch
    )
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-green">
      <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-black shadow-2xl -mt-14">
        
        {/* Role selection buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              role === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setRole('User')}
          >
            Login as User
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              role === 'Driver' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setRole('Driver')}
          >
            Login as Driver
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {role} Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email/Mobile
            </label>
            <input
              // type="email"
              id="email"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email or mobile "
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg shadow-md ${
              role === 'User' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            Login as {role}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
