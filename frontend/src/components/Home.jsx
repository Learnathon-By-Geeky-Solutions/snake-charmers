import { Link } from "react-router-dom";
import ambulanceImage from "../assets/images/Ambulanceimage.png"; // Correctly import the image

function Home() {
  return (
    <div className="flex justify-between items-center px-8 mt-20">
      {/* Left side: Text */}
      <div className="w-1/2 text-left">
        <h1 className="text-3xl font-bold text-black mb-4">
          Ambulance Sharing Platform – Saving Lives, Multiple Rides at a Time
        </h1>
        <p className="text-base text-gray-700 mb-6">
          Our Ambulance sharing platform is designed to revolutionize emergency medical response. With our services, you can quickly and effortlessly book an Ambulance, ensuring faster response times and life-saving assistance when it matters most. Choose us to enhance your Ambulance experience and make every second count in critical moments. Together, we can save lives.
        </p>
        <div className="mt-6">
          <Link to="/signup">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mr-4">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
              Log In
            </button>
          </Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="w-1/2 flex justify-center">
        <img 
          src={ambulanceImage} 
          alt="Ambulance" 
          className="w-full max-w-[400px] object-contain" 
        />
      </div>
    </div>
  );
}

export default Home;
