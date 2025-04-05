import MapComponent from "./MapComponent/MapComponent";
import PatientRequestComponent from "./PatientRequestComponent/PatientRequestComponent";
import PropTypes from 'prop-types';

const MainContent = ({isAvailable, isCheckedOut, toggleAvailability, totalIncomingRequests}) => {
    return (
      <div className="mb-8 bg-white flex flex-col justify-center items-center">
        {/* Using the same width classes as StatusBar */}
        <div className="flex-grow flex flex-col lg:flex-row w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[67%] gap-4">
          {/* Left Panel - Map */}
          <MapComponent
            isCheckedOut={isCheckedOut}
          />
          {/* Right Panel - Patient Requests Handler */}
          <PatientRequestComponent
            isAvailable={isAvailable}
            isCheckedOut={isCheckedOut}
            toggleAvailability={toggleAvailability}
            totalIncomingRequests={totalIncomingRequests}
          />
        </div>
    </div>
  )
}
MainContent.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
  isCheckedOut: PropTypes.bool.isRequired,
  toggleAvailability: PropTypes.func.isRequired,
  totalIncomingRequests: PropTypes.number.isRequired,
};

export default MainContent;