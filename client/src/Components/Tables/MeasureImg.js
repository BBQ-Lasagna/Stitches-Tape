import React from 'react';
import MeasureImg from '../../Images/MeasureImg.jpg';
import './Measure.css';

const MeasureImage = () => {
  return (
    <div>
      <img
        src={MeasureImg}
        className='models responsive-img'
        alt='Measurement Examples'
      />
    </div>
  );
};

export default MeasureImage;
