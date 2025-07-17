import React from 'react';
import "./SubmitButton.css"

const ResetButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="submitButton">
      Submit
    </button>
  );
};

export default ResetButton;
