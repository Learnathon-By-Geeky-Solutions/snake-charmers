import PropTypes from 'prop-types';

const LoadingIndicator = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-purple-800 text-center font-medium">{text}</p>
      <p className="text-sm text-purple-600 mt-2">This usually takes less than a minute</p>
    </div>
  );

LoadingIndicator.propTypes = {
  text: PropTypes.string.isRequired,
};

export default LoadingIndicator