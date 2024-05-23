import React from 'react';
import './Popup.css';

const Popup = ({ message, onYes, onNo }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </div>
    </div>
  );
};

export default Popup;
