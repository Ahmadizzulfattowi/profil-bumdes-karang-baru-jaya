// components/fields/FileField.jsx
import React from "react";

const FileField = ({
  label,
  currentImage,
  getFileUrl,
  onFileChange,
  fileState,
  required = false,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {currentImage && (
        <div className="flex items-center mb-2 space-x-3">
          <img
            src={getFileUrl(currentImage)}
            alt="Preview"
            className="object-cover w-20 h-20 rounded-md shadow"
          />
          <p className="text-xs text-gray-500">{currentImage}</p>
        </div>
      )}

      {fileState && (
        <p className="text-xs text-blue-600">
          📂 File baru: {fileState.name}
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        required={required}
        className="px-3 py-2 text-sm border rounded-lg cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-none file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
};

export default FileField;
