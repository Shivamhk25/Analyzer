import React, { useRef } from "react";
import ReactDom from "react-dom";

export const Modal1 = ({ setShowModal }) => {
  // close the modal when clicking outside the modal.
  //render the modal JSX in the portal div.
  return (
    <div className="popup">
      <div className="popup_open">
        <h1>
          Attention! app does not seem enabled from app embed section in theme
          settings.
        </h1>
        <div className="btn-container">
          <button className="cancel-btn">
            <a href="mailto:Support@z08tech.com">Contact Support</a>
          </button>
          <button
            className="watch-btn"
            onClick={() => {
              window.open(
                "https://www.youtube.com/watch?v=Bn25OtwLoJI&feature=youtu.be",
                "_blank"
              );
              // setShowModal(false);
            }}
          >
            Watch Setup Demo
          </button>
        </div>
      </div>
    </div>
  );
};
