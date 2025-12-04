// components/admin/NavItem.jsx
import React from "react";

const NavItem = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 mb-2 text-left transition rounded-lg ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export default NavItem;
