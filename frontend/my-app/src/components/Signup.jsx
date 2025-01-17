import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MdDriveEta } from "react-icons/md";
import { FaUser } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate(); // Initialize navigate function

  // Navigate to User page
  const handleUserSignup = () => {
    navigate("/user"); // Replace "/user" with the actual path for the user page
  };

  // Navigate to Driver page
  const handleDriverSignup = () => {
    navigate("/driver"); // Replace "/driver" with the actual path for the driver page
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <div className="flex flex-col gap-6">
          {/* Sign Up as User */}
          <button
            className="flex items-center gap-4 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleUserSignup} // Handle user signup click
          >
            <FaUser className="text-2xl" />
            <span className="text-lg font-medium">Sign Up as a User</span>
          </button>

          {/* Sign Up as Driver */}
          <button
            className="flex items-center gap-4 p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            onClick={handleDriverSignup} // Handle driver signup click
          >
            <MdDriveEta className="text-2xl" />
            <span className="text-lg font-medium">Sign Up as a Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
