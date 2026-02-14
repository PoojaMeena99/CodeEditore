import React from "react";
import "./LanguageDropdown.css";

const LanguageDropdown = ({ value, onChange }) => {
  return (
    <div className="dropdown-container">
      <label htmlFor="languageDropdown" className="dropdown-label">
        Languages:
      </label>
      <select
        id="languageDropdown"
        value={value}
        onChange={onChange}
        className="dropdown-select"
      >
        <option value="JavaScript">JavaScript</option>
        <option value="Python">Python</option>
        <option value="Java">Java</option>
        <option value="C">C</option>
        <option value="C++">C++</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
