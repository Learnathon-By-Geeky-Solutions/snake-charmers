import {Ambulance, AlertTriangle} from 'lucide-react';
import PropTypes from 'prop-types';

const Header = ({role, handleEndTrip}) => {
    return (
        <div className="px-6 py-5 rounded-xl flex justify-between items-center bg-gradient-to-r from-emerald-500/90 to-teal-600/90 shadow-xl">
            <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <Ambulance className="w-6 h-6 text-white stroke-[2]" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                        Critical Patient Transport
                    </h2>
                    <p className="text-sm text-white/80 mt-1 max-w-xs">
                        Rapid and Specialized Medical Response
                    </p>
                </div>
            </div>
            {role === "driver" && (
                <button 
                    onClick={handleEndTrip}
                    className="group relative px-6 py-2.5 rounded-xl text-sm font-semibold 
                        text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 
                        transition-all duration-300 ease-in-out 
                        flex items-center space-x-2"
                >
                    <AlertTriangle className="w-5 h-5 text-white stroke-[2] group-hover:animate-pulse" />
                    <span>End Response</span>
                </button>
            )}
        </div>
    )
}

Header.propTypes = {
    role: PropTypes.string.isRequired,
    handleEndTrip: PropTypes.func.isRequired,
};

export default Header;