import React from 'react';

const GoogleMap = () => (
    <div className="w-full h-full flex justify-center items-center">
      <iframe
        title="Google Map"
        className="w-full h-full rounded-lg shadow-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025243794027!2d90.39945271538538!3d23.750895984589494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfe69b9a52e5%3A0x9c1a85a6d3f75823!2sDhaka!5e0!3m2!1sen!2sbd!4v1649757295978!5m2!1sen!2sbd"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
  
export default GoogleMap