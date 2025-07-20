import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-evenly items-center headerBg py-4">
      <div className="flex items-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flipkart_logo.png/800px-Flipkart_logo.png"
          alt="Logo"
          className="h-8"
        />
      </div>

      <button onClick={handleHome}>
        <h1 className="text-white text-2xl font-bold underline-offset-4 underline">
          Vendor Admin Portal
        </h1>
      </button>

      {/* User Options */}
      <div className="flex items-center space-x-4">
        <Button label={"Login"} onClick={handleLogin} />
        <Button label={"Upload New Product"} />
        {/* <button className="hidden sm:block hover:underline">More</button> */}
      </div>
    </div>
  );
};

export default Header;
