import { Clock, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import formatETA from '../../../utils/utils';

const ETA = () => {
    const source = useSelector(state => state.driverLocation);
    const destination = useSelector(state => state.user);
    const [eta, setEta] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [showLastDot, setShowLastDot] = useState(true);
    
    useEffect(() => {
        let blinkInterval;
        if (isLoading) {
            blinkInterval = setInterval(() => {
                setShowLastDot(prev => !prev);
            }, 500);
        }
        
        return () => {
            if (blinkInterval) clearInterval(blinkInterval);
        };
    }, [isLoading]);

    useEffect(() => {
        setIsLoading(true);
        const fetchETA = async () => {
            try {
                const response = await fetch(
                    `http://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=false`
                );
                const data = await response.json();
                const calculatedEta = data.routes[0].duration / 60; // ETA in minutes
                setEta(calculatedEta);
                setIsLoading(false);
                
            } catch (error) {
                console.log("Error calculating ETA: ", error);
            }
        }

        if(source.isSet) fetchETA();
    }, [source]);

    return (
        <div className="bg-white border border-gray-200 rounded-[16px] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                <div className="relative w-full h-full bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent animate-progress-beam"></div>
                </div>
            </div>
            
            <div className="p-5 flex items-center space-x-4">
                <div className="bg-emerald-50 p-3 rounded-2xl">
                    <Clock className="w-6 h-6 text-emerald-600 stroke-[2]" />
                </div>
                
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Estimated Arrival
                        </span>
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">
                                {source.isSet ? 'Route Active' : 'No Route'}
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="h-8 flex items-center">
                            <p className="text-lg font-medium text-gray-600 flex items-end">
                                Calculating
                                <p>
                                    <span className="text-3xl font-bold leading-none text-gray-500 ml-2">.</span>
                                    <span className="text-3xl font-bold leading-none text-gray-500">.</span>
                                    <span className={`text-3xl font-bold leading-none text-gray-500 ${showLastDot ? 'opacity-100' : 'opacity-0'}`}>.</span>
                                </p>
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-gray-800">
                                {eta === -1 ? '--' : formatETA(eta)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ETA;