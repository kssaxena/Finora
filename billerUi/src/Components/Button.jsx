import React from "react";

const Button = ({ onClick, className, label, type, Disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={Disabled}
      className={`bg-[#DF3F33] px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out ${className} text-white  `}
    >
      {label}
    </button>
  );
};

export default Button;
