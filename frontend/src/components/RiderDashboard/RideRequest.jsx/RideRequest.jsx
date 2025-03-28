import RideSearchForm from "../RideSearchForm/RideSearchForm"
import DriverResponse from "../../DriverResponse/DriverResponse";
import PropTypes from 'prop-types';

const RideRequest = ({isRequested, pickupLocation, dropoffLocation, setPickupLocation, setDropoffLocation, handleSearch, isFormValid, isLoading, error, fare, setFare}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
            
            {/* Left Side - Centered Ride Search Form */}
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

            {/* Right Side - Ride Request Image */}
            {isRequested ? (
              (  <DriverResponse 
                  pickup_location = {pickupLocation}
                  destination = {dropoffLocation}
                  fare = {parseInt(fare)}
                />
              )
            ) : (
              <div className="flex justify-center">
                <img
                  src="/src/assets/images/driverPageRequest 1.png"
                  alt="Ride Request"
                  className="w-80 h-80 rounded-lg shadow-lg"
                />
              </div>
            )}
        </div>
    )
}
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

export default RideRequest