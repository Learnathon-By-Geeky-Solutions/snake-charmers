import { FaMapMarkedAlt } from "react-icons/fa";
import RouteMap from "../../../Map/RouteMap";
import PropTypes from "prop-types";
import LocationPointerMap from "../../../Map/LocationPointMap";
import { useSelector } from "react-redux";

const MapComponent = ({isCheckedOut}) => {
    const { latitude, longitude } = useSelector(state => state.user);
    return (
        <div className="w-full lg:w-[65%] mt-4 sm:mt-6 flex flex-col h-[40vh] sm:h-[50vh] lg:h-[70vh]">
            <div className="flex items-center mb-2 sm:mb-4">
                <FaMapMarkedAlt className="text-blue-700 text-lg sm:text-xl mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{isCheckedOut ? "Service Route" : "Current Location"}</h3>
            </div>
            <div className="bg-white shadow-lg overflow-hidden flex-grow border border-gray-200 rounded-md">
                {isCheckedOut ?
                    <RouteMap/> 
                    : 
                     <LocationPointerMap
                        latitude={latitude}
                        longitude={longitude}
                    />
                }
            </div>
        </div>
    )
}
MapComponent.propTypes = {
    isCheckedOut: PropTypes.bool.isRequired,
};

export default MapComponent;