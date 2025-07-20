import Hero from "./pages/Hero/Hero";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import VendorRegistrationForm from "./pages/Registration/Registration";
import LoginForm from "./pages/Login/Login";
import Dashboard from "./pages/DashBoard/Dashboard";
import VendorProfile from "./components/VendorProfile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser } from "./utils/Slice/UserInfoSlice";
import { FetchData } from "./utils/FetchFromApi";
import { parseErrorMessage } from "./utils/ErrorMessageParser";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function reLogin() {
      const RefreshToken = localStorage.getItem("RefreshToken");
      if (!RefreshToken) return;

      // Refresh the access token using refresh token
      try {
        const User = await FetchData("vendor/re-login", "post", {
          RefreshToken,
        });

        // console.log(User);
        localStorage.clear(); // will clear the all the data from localStorage
        localStorage.setItem("AccessToken", User.data.data.tokens.AccessToken);
        localStorage.setItem(
          "RefreshToken",
          User.data.data.tokens.RefreshToken
        );

        // Storing data inside redux store
        dispatch(clearUser());
        dispatch(addUser(User.data.data.user));
        return User;
      } catch (error) {
        console.log(error);
        alert(parseErrorMessage(error));
      }
    }

    reLogin();
  }, []);

  return (
    <div className="text-black whiteSoftBG">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Hero />} />
        <Route path="/register" element={<Hero />} />
        <Route path="/vendor-profile" element={<VendorProfile />} />
      </Routes>
    </div>
  );
}

export default App;
