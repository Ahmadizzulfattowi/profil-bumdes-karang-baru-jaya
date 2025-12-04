// components/fields/TextAreaField.jsx
import React from "react";

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="px-3 py-2 text-sm border rounded-lg shadow-sm outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>
  );
};

export default TextAreaField;
