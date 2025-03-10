import { useState } from 'react';

const OverallSignup = () => {
  const [role, setRole] = useState('User'); // Default role is "User"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-6"> {/* Removed top margin */}
      <div className="w-full max-w-lg bg-white shadow-2xl shadow-black rounded-lg p-7">
        {/* Role selection buttons */}
        <div className="flex justify-center gap-4 mb-6">
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

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {role} Signup Here
        </h2>

        <form>
          {/* Name Field - Label & Input Side by Side */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="username">
              Name:
            </label>
            <input
              type="text"
              id="username"
              placeholder={`Enter your ${role.toLowerCase()} name`}
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Number Field */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="contact">
              Contact No:
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Enter your contact number"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="confirmPassword">
              Confirm:
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
