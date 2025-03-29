import GoogleMap from "../../../Map/Map";
import { FaMapMarkedAlt } from "react-icons/fa";
import RouteMap from "../../../Map/RouteMap";
import PropTypes from "prop-types";

const MapComponent = ({isCheckedOut}) => {
    return (
        <div className="w-[65%] mt-6 flex flex-col h-[70vh]">
            <div className="flex items-center mb-4">
                <FaMapMarkedAlt className="text-blue-700 text-xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">{isCheckedOut ? "Service Route" : "Current Location"}</h3>
            </div>
            <div className="bg-white  shadow-lg overflow-hidden flex-grow border border-gray-200">
                {isCheckedOut ?
                    <RouteMap/> 
                    : 
                    <GoogleMap />
                }
            </div>
        </div>
    )
}
MapComponent.propTypes = {
    isCheckedOut: PropTypes.bool.isRequired,
};

export default MapComponent;