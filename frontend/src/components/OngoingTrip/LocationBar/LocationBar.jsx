import PropTypes from 'prop-types';
import {Stethoscope, MapPin} from 'lucide-react';

const LocationBar = ({pickup_location, destination}) =>{
    return(
        <div className="bg-slate-100 p-4 rounded-2xl shadow-xl border border-slate-200 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Stethoscope className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
              <div>
                <p className="text-xs text-slate-500">Current Status</p>
                <span className="text-base font-semibold text-slate-800">Emergency Response</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <MapPin className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
              <div>
                <p className="text-xs text-slate-500">Route</p>
                <span className="truncate text-sm font-medium">{pickup_location} → {destination}</span>
              </div>
            </div>
        </div>
    )
}
LocationBar.propTypes = {
    pickup_location: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
};

export default LocationBar;
