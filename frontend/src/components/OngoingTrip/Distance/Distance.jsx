import { Map } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const formatDistance = (kilometers) => {
    if (kilometers <= 0) return 'Arrived';
    if (kilometers < 1) return `${Math.round(kilometers * 1000)} meters`;
    if (kilometers < 10) return `${kilometers.toFixed(1)} km`;
    return `${Math.round(kilometers)} km`;
};

const Distance = () => {
    const source = useSelector(state => state.user);
    const destination = useSelector(state => state.ongoingTripDetails);
    const [distance, setDistance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDistance = async () => {
            setIsLoading(true);
            
            try {
                const response = await fetch(
                    `http://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=false`
                );
                
                const data = await response.json();
                console.log(data);
                const calculatedDistance = data.routes[0].distance / 1000; // Distance in kilometers
                

                setDistance(calculatedDistance);
                setIsLoading(false);

            } catch (error) {
                console.error("Error calculating distance: ", error);
                setIsLoading(false);
            }
        }

        fetchDistance();
    }, [source, destination]);

    return (
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                <div className="relative w-full h-full bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/90 to-transparent animate-progress-beam"></div>
                </div>
            </div>
            
            <div className="p-5 flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-2xl">
                    <Map className="w-6 h-6 text-blue-600 stroke-[2]" />
                </div>
                
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Remaining Distance
                        </span>
                        <div className="flex items-center space-x-1">
                            <Map className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">
                                {source.isSet ? 'Route Active' : 'No Route'}
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="h-8 flex items-center justify-center">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                        </div>
                    ) :  (
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-gray-800">
                                {distance === null ? '--' : formatDistance(distance)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Distance;