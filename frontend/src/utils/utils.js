const formatETA = (minutes) => {
    if (minutes <= 0) return 'Arriving now';
    if (minutes < 1) return 'Less than a minute';
    if (minutes < 2) return '1 minute';
    return `${Math.round(minutes)} minutes`;
};

export default formatETA