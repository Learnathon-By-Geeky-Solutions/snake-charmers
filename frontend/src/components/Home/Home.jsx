import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ambulanceImage from '../../assets/images/ambulance_image_final_1.png';
import { FaAmbulance, FaClock, FaUserMd, FaMapMarkedAlt, FaDollarSign, FaUsers, FaRoute, FaMobile } from 'react-icons/fa';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const features = [
    {
      icon: <FaAmbulance className="text-red-500" size={28} />,
      title: "Quick Response",
      description: "Get immediate assistance during emergencies with our rapid response system."
    },
    {
      icon: <FaClock className="text-blue-500" size={28} />,
      title: "Available 24/7",
      description: "Our service operates round the clock to ensure help is always available."
    },
    {
      icon: <FaUserMd className="text-green-500" size={28} />,
      title: "Skilled Professionals",
      description: "All our ambulances are staffed with trained medical professionals."
    },
    {
      icon: <FaMapMarkedAlt className="text-purple-500" size={28} />,
      title: "Real-Time Tracking",
      description: "Track your ambulance in real-time for accurate arrival estimates."
    }
  ];

  const howItWorks = [
    {
      title: "Request an Ambulance",
      description: "Enter your location and the type of medical assistance you need."
    },
    {
      title: "Choose Your Provider",
      description: "Select from available ambulance providers based on ratings, ETA, and price."
    },
    {
      title: "Track in Real-Time",
      description: "Monitor the ambulance's location and get accurate arrival time estimates."
    },
    {
      title: "Receive Care",
      description: "Get professional medical assistance from certified healthcare providers."
    }
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <div className="px-6 py-12 md:py-20 max-w-7xl mx-auto">
          <div className="mt-20 flex flex-col md:flex-row items-center">
            {/* Left side: Text */}
            <div className="w-full md:w-1/2 text-left md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Ambulance Sharing Platform – <span className="text-red-600"> Saving Lives</span>, Multiple Rides at a Time
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our Ambulance sharing platform is designed to 
                revolutionize emergency medical response. 
                With our services, you can quickly and effortlessly book an 
                Ambulance, ensuring faster response times and life-saving 
                assistance when it matters most.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/signup">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-white hover:bg-gray-100 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium transition-colors shadow-md">
                    Log In
                  </button>
                </Link>
              </div>
            </div>

            {/* Right side: Image with animation */}
            <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-4">
                  <img 
                    src={ambulanceImage} 
                    alt="Ambulance" 
                    className="w-full h-auto object-contain" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose LifeRide?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index + 1} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index + 1} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Price Bidding Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 md:pr-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Price Bidding & Negotiation</h2>
              <p className="text-lg text-gray-700 mb-4">
                Our innovative bidding system allows you to receive competitive pricing from multiple ambulance providers, ensuring you get the best value without compromising on quality.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-green-500">✓</div>
                  <p>Compare quotes from multiple providers in real-time</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-green-500">✓</div>
                  <p>Negotiate directly with providers for special circumstances</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-green-500">✓</div>
                  <p>Transparent pricing with no hidden fees</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-green-500">✓</div>
                  <p>Insurance integration for simplified billing</p>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center">
                    <FaDollarSign className="text-green-500 mr-2" size={24} />
                    <span className="font-semibold">Price Comparison</span>
                  </div>
                  <span className="text-sm text-gray-500">3 quotes available</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg flex justify-between items-center bg-blue-50 border-blue-200">
                    <div>
                      <p className="font-medium">MediRush Ambulance</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">★★★★☆</span>
                        <span>4.2 (120 rides)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">$75.00</p>
                      <p className="text-sm text-gray-600">ETA: 8 min</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">LifeSaver Express</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">★★★★★</span>
                        <span>4.8 (98 rides)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$82.50</p>
                      <p className="text-sm text-gray-600">ETA: 6 min</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">QuickMed Services</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">★★★★☆</span>
                        <span>4.3 (67 rides)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$79.00</p>
                      <p className="text-sm text-gray-600">ETA: 10 min</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                  Select Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Selection Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="w-full md:w-1/2 md:pl-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Choose the Best Provider</h2>
              <p className="text-lg text-gray-700 mb-4">
                With multiple ambulance providers available, you have the freedom to choose based on what matters most to you:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FaUsers className="text-blue-500 mr-2" size={20} />
                    <h3 className="font-semibold">Driver Ratings</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Select providers with the highest customer ratings and reviews.</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FaClock className="text-blue-500 mr-2" size={20} />
                    <h3 className="font-semibold">Fastest ETA</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Choose the provider that can reach you the quickest.</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FaDollarSign className="text-blue-500 mr-2" size={20} />
                    <h3 className="font-semibold">Best Pricing</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Find the most competitive rates that fit your budget.</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FaUserMd className="text-blue-500 mr-2" size={20} />
                    <h3 className="font-semibold">Medical Equipment</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Filter by specific medical equipment or professional specialties.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-6">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-xl mb-2">Top Rated Providers</h3>
                    <p className="text-gray-600 text-sm">Based on your location</p>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((provider) => (
                      <div key={provider} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <FaAmbulance className="text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium">Provider {provider}</p>
                            <div className="flex items-center text-sm text-yellow-500">
                              {'★'.repeat(5 - provider % 2)}{'☆'.repeat(provider % 2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{5 + provider} min away</p>
                          <p className="font-semibold">${70 + provider * 5}.00</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link to="/providers">
                      <button className="text-blue-600 font-medium hover:underline">View all providers</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Tracking Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Real-Time Tracking & ETA</h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Know exactly when help will arrive with our advanced real-time tracking system. Reduce anxiety and prepare for the ambulance arrival with accurate information.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex flex-col items-center max-w-xs">
              <div className="p-4 bg-blue-600 text-white rounded-full mb-4">
                <FaRoute size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Live Route Tracking</h3>
              <p className="text-center text-gray-600">
                Follow your ambulance's exact route in real-time on an interactive map as it navigates to your location.
              </p>
            </div>
            
            <div className="flex flex-col items-center max-w-xs">
              <div className="p-4 bg-green-600 text-white rounded-full mb-4">
                <FaClock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Precise ETA Updates</h3>
              <p className="text-center text-gray-600">
                Receive continuous updates on the estimated time of arrival, accounting for traffic and route changes.
              </p>
            </div>
            
            <div className="flex flex-col items-center max-w-xs">
              <div className="p-4 bg-purple-600 text-white rounded-full mb-4">
                <FaMobile size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Share Location & Status</h3>
              <p className="text-center text-gray-600">
                Share tracking information with family members so they can monitor the ambulance's progress remotely.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="border-b pb-4 mb-4">
              <h3 className="font-bold text-xl">Your Ambulance is En Route</h3>
              <p className="text-gray-600">Driver: Michael S. • LifeSaver Express</p>
            </div>
            
            <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
              <p className="text-gray-500 font-medium">Interactive Map View</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">Main St & 5th Ave</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Arrival</p>
                <p className="font-bold text-green-600">6 minutes</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <button className="flex items-center text-blue-600 font-medium">
                  <span className="mr-2">Call Driver</span>
                </button>
                <button className="flex items-center text-blue-600 font-medium">
                  <span className="mr-2">Share Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Make Every Second Count in Critical Moments</h2>
          <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
            Choose us to enhance your ambulance experience. Together, we can save lives.
          </p>
          <Link to="/ride_request">
            <button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium shadow-md transition-colors">
              Request an Ambulance Now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Ambulance Rides</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">On-time Arrival</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Medical Professionals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                city: "Boston",
                quote: "The price negotiation feature saved me money while still getting high-quality emergency care. The ETA was accurate to the minute."
              },
              {
                name: "Robert Chen",
                city: "San Francisco",
                quote: "Being able to choose between multiple providers gave me peace of mind. I selected based on ratings and wasn't disappointed."
              },
              {
                name: "Maria Garcia",
                city: "Miami",
                quote: "The real-time tracking was invaluable during my mother's emergency. We knew exactly when to expect the ambulance."
              }
            ].map((testimonial, index) => (
              <div key={index + 1} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center text-yellow-500 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;