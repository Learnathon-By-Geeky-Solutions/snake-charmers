import React from 'react';

const GoogleMap = () => (
    <div className="w-full flex justify-center">
          <iframe
            title="Google Map"
            width="90%"
            height="400"
            className="rounded-lg shadow-2xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.126991404184!2d91.807229414965!3d22.356851185285853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad27582ff5c2ef%3A0x3e696c9b6b4d962c!2sChittagong%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1649761307864!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div> 
  );
  
export default GoogleMap