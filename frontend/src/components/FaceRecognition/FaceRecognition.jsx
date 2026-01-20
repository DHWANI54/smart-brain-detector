import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box, onImageLoaded }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2 image-container'>
        <img
          id='inputimage'
          alt=''
          src={imageUrl}
          width='500px'
          height='auto'
          className='small-img'
          onLoad={onImageLoaded}
        />
        {box && box.width && (
          <div className='bounding-box' style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height
          }}></div>
        )}
      </div>
    </div>
  );
}

export default FaceRecognition;
