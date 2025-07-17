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
        <option value="HTML">HTML</option>
        <option value="CSS">CSS</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
