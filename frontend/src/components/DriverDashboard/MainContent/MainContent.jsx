import MapComponent from "./MapComponent/MapComponent";
import PatientRequestComponent from "./PatientRequestComponent/PatientRequestComponent";
import PropTypes from 'prop-types';

const MainContent = ({isAvailable, isCheckedOut, toggleAvailability, totalIncomingRequests}) => {
    return (
      <div className="min-h-screen bg-white flex flex-col ml-20 mr-20 justify-center items-center">

        <div className="flex-grow flex w-[70%]">

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