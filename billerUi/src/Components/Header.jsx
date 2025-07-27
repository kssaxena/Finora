import { LogIn, LogOut, User2 } from "lucide-react";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../Utility/Slice/UserInfoSlice";
import LOGO from "../assets/Logo.png";

const Header = () => {
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);
  const dispatch = useDispatch();

  const Navigate = useNavigate();

  const NavigateLogin = () => {
    dispatch(clearUser());
    alert("You are logged out! Please log in");
    localStorage.clear();
    Navigate("/");
  };
  const NavigateToProfile = () => {
    Navigate(`/user-profile/dashboard/${user?.[0]?._id}`);
  };

  return (
    <header className="flex justify-between items-center mb-4 px-5 ">
      {/* Logo */}
      <div className="flex items-center">
        <Link to={"/home"}>
          <img src={LOGO} alt="Logo" className="w-20" />
        </Link>
      </div>
      <div className="flex items-center gap-5 px-4 py-5">
        {user.length > 0 ? (
          <div>
            <Button
              className={`  hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <User2 />
                  </span>
                  {user?.[0]?.name}
                </h1>
              }
              // onClick={NavigateToProfile}
            />
            <Button
              className={`  hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex  justify-start gap-2">
                  <span>
                    <LogOut />
                  </span>
                  Log Out{" "}
                </h1>
              }
              onClick={NavigateLogin}
            />
          </div>
        ) : (
          <div>
            <Button
              className={`  hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex  justify-start gap-2">
                  <span>
                    <LogIn />
                  </span>
                  Login{" "}
                </h1>
              }
              onClick={NavigateLogin}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
