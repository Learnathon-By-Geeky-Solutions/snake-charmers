import PuffLoader from "react-spinners/PuffLoader";
import PropTypes from 'prop-types';

export const PuffLoaderComponent = ({text}) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-indigo-900/95">
      <div className="bg-gradient-to-b from-indigo-800 to-purple-900 text-white p-8 w-full h-full flex flex-col justify-center items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-lg"></div>
          <PuffLoader size={70} color="#c4b5fd" />
        </div>
        
        <p className="text-xl font-semibold mb-3 text-center text-white">
          {text}
        </p>
        
        <div className="w-16 h-0.5 bg-indigo-400/50 rounded-full mb-4"></div>
        
        <p className="text-sm text-indigo-200 text-center">
          This usually takes less than a minute
        </p>
      </div>
    </div>
  );
};
PuffLoaderComponent.propTypes = {
  text: PropTypes.string.isRequired,
};

export default PuffLoaderComponent;