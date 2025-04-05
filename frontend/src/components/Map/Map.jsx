import React from 'react';
import { useSelector } from 'react-redux';

const GoogleMap = () => {
    const {latitude, longitude} = useSelector(state => state.user);
    let mapsrc=`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.126991404184!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad27582ff5c2ef%3A0x3e696c9b6b4d962c!2sChittagong%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1649761307864!5m2!1sen!2sbd`

    return(
      <div className="w-full flex justify-center">
        <iframe
          title="Google Map"
          width="90%"
          height="350"
          className="rounded-lg shadow-xl md:shadow-2xl md:h-450 lg:h-620"
          src={mapsrc}
          allowFullScreen=""
          loading="lazy"
          style={{ height: 'clamp(350px, 50vh, 620px)' }}
        ></iframe>
      </div> 
    );
}
export default GoogleMap;