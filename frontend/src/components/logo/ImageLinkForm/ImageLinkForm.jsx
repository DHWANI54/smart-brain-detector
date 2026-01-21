import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onFileUpload }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <p className="f3 white">
        {"This Magic Brain will detect faces in your pictures. Give it a try."}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5 flex flex-column items-center">
          <div className="w-100 flex mb3">
            <input
              className="f4 pa2 w-70 center"
              type="text"
              placeholder="Paste Image URL"
              onChange={onInputChange}
            />
            <button
              className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
              onClick={onButtonSubmit}
            >
              Detect
            </button>
          </div>
          <div className="white f4 mv2">OR</div>
          <div className="w-100 flex justify-center">
            <label className="f4 link ph3 pv2 dib white bg-dark-blue pointer grow br2">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
