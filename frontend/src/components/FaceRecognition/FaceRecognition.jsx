import React, { useState } from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="center">
      <div className="image-container">
        {imageUrl && (
          <img
            id="inputimage"
            className="small-img"
            alt=""
            src={imageUrl}
            onLoad={handleImageLoad}
          />
        )}

        {imageLoaded && (
          <div
            className="bounding-box"
            style={{
              top: "50%",
              left: "50%",
              width: "150px",
              height: "150px",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;
