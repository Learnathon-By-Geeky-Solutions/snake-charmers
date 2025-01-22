import { useState } from 'react';

const OverallSignup = () => {
  const [role, setRole] = useState('User'); // Default role is "User"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-7">
        <div className="flex justify-center gap-4 mb-6">
          {/* Buttons to switch between User and Driver */}
          <button
            className={`px-4 py-2 rounded-lg ${
              role === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setRole('User')}
          >
            Sign Up as User
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              role === 'Driver' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setRole('Driver')}
          >
            Sign Up as Driver
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {role} Signup Here
        </h2>

        <form>
          {/* User Name */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
              Name
            </label>
            <input
              type="text"
              id="username"
              placeholder={`Enter your ${role.toLowerCase()} name`}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Number */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="contact">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Enter your contact number"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg shadow-md ${
              role === 'User' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            Sign Up as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverallSignup;
