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
    <div className="min-h-screen flex flex-col items-center justify-center -mt-6">
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* mobile Number Field */}
          <div className="mb-3 flex items-center">
            <label className="w-32 text-gray-700 text-sm font-bold" htmlFor="mobile">
              Mobile:
            </label>
            <input
              type="text"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
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
              value={formData.password}
              onChange={handleChange}
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
              value={formData.confirmPassword}
              onChange={handleChange}
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
