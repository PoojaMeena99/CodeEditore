import React from 'react';
import "./RunButton.css"

const RunButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-run">
      Run
    </button>
  );
};

export default RunButton;

