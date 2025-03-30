import { useState } from 'react';
import handleSignUp from '../../controllers/Signup';

const OverallSignup = () => {
  const [role, setRole] = useState('User'); // Default role is "User"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log(`Signing up as ${role}`);
    handleSignUp({
      ...formData,
      user_type: (role === 'User' ? 'rider' : 'driver'),
    })
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 border border-gray-100">
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
          Create Your {role} Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={`Enter your ${role.toLowerCase()} name`}
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1" htmlFor="mobile">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverallSignup;