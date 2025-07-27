import React, { useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import { addUser, clearUser } from "../../utils/Slice/UserInfoSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingUI from "../../components/Loading";
import Button from "../../components/Button";

const LoginForm = ({ startLoading, stopLoading, openRegister }) => {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      startLoading();
      const response = await FetchData("vendor/login", "post", credentials);
      console.log(response);
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.vendor));
      setSuccess("Login successful!");

      localStorage.clear();

      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.accessToken
      ); // Save token to localStorage
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.refreshToken
      ); // Save token to localStorage
      Navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 backdrop-blur-sm shadow-lg rounded-lg w-96">
      <h1 className="text-2xl font-bold text-gray-800 lg:mb-6">Login</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="lg:space-y-6">
        {/* Email Input */}
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={credentials.email}
          Placeholder="Enter your email"
          onChange={handleChange}
        />

        {/* Password Input */}
        <InputBox
          LabelName="Password"
          Type="password"
          Name="password"
          Value={credentials.password}
          Placeholder="Enter your password"
          onChange={handleChange}
        />

        {/* Submit Button */}
        <div>
          <Button Type={"submit"} label={"Login"} className={"w-full"} />
          {/* <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button> */}
        </div>
      </form>
      <div className="lg:block hidden">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            className="font-bold underline text-blue-500 cursor-pointer"
            onClick={openRegister}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoadingUI(LoginForm);
