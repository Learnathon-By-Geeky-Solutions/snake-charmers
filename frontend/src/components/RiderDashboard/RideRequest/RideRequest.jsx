// RideRequest.jsx - Responsive version
import React from "react";
import RideSearchForm from "../RideSearchForm/RideSearchForm";
import DriverResponse from "../../DriverResponse/DriverResponse";
import PropTypes from 'prop-types';
import { FaAmbulance } from "react-icons/fa";
import RideRequestImg from '../../../assets/images/RideRequestImg.png';

const RideRequest = ({
  isRequested, 
  pickupLocation, 
  dropoffLocation, 
  setPickupLocation, 
  setDropoffLocation, 
  handleSearch, 
  isFormValid, 
  isLoading, 
  error, 
  fare, 
  setFare
}) => {
  return (
    <div className="w-full mx-auto px-2 md:px-4 py-4 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Emergency Medical Transport</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
          Connect with nearby ambulance services for quick and reliable medical transportation
        </p>
      </div>
      {isRequested ? 
        <div className="bg-white rounded-xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <DriverResponse 
            pickup_location={pickupLocation}
            destination={dropoffLocation}
            fare={parseInt(fare)}
          />
        </div>
      :
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Left Side - Ride Search Form */}
        <div className="order-2 lg:order-1">
          <RideSearchForm
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            setPickupLocation={setPickupLocation}
            setDropoffLocation={setDropoffLocation}
            handleSearch={handleSearch}
            isFormValid={isFormValid}
            isLoading={isLoading}
            error={error}
            fare={fare}
            setFare={setFare}
          />
        </div>

        {/* Right Side - Driver Response or Image */}
        <div className="order-1 lg:order-2">
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-3xl shadow-xl border border-gray-100 text-center">
            <div className="mb-4 md:mb-6">
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <FaAmbulance className="text-red-500 text-xl md:text-2xl" />
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Ready When You Need Us</h2>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Fill out the form to connect with available ambulance services in your area</p>
            </div>
            
            <img
              src={RideRequestImg}
              alt="Emergency Medical Transport"
              className="w-full h-auto max-h-48 md:max-h-64 object-contain rounded-lg mx-auto"
            />
            
            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-8 md:mt-16">
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-medium text-gray-800">24/7 Service</p>
              </div>
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-medium text-gray-800">Trained EMTs</p>
              </div>
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-medium text-gray-800">Quick Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  );
};

RideRequest.propTypes = {
  isRequested: PropTypes.bool.isRequired,
  pickupLocation: PropTypes.string.isRequired,
  dropoffLocation: PropTypes.string.isRequired,
  setPickupLocation: PropTypes.func.isRequired,
  setDropoffLocation: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  fare: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFare: PropTypes.func.isRequired,
};

export default RideRequest;