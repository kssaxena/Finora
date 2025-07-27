import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import { useDispatch } from "react-redux";
import { FetchData } from "./Utility/FetchFromApi";
import { parseErrorMessage } from "./Utility/ErrorMessageParser";
import { useSelector } from "react-redux";
import { clearUser, addUser } from "./Utility/Slice/UserInfoSlice";
import Dashboard from "./Pages/Home/Home";
import AdminRegister from "./Pages/Register/Register";
import AdminLogin from "./Pages/Login/Login";
import CurrentUser from "./Pages/CurrentUser/CurrentUser";
import CurrentProduct from "./Pages/CurrentProduct/CurrentProduct";
import CurrentOrder from "./Pages/CurrentOrder/CurrentOrder";
import CurrentUnVerifiedVendor from "./Pages/Current-UnVerifiedVendor/CurrentUnVerifiedVendor";
import CurrentVerifiedVendor from "./Pages/Current-VerifiedVendor/CurrentVerifiedVendor";
import { fetchCategories } from "./Utility/Slice/CategorySlice";
import Promotion from "./Pages/Promotions/promotion";
import CurrentTransactionOnline from "./Pages/CurrentTransactionOnline/CurrentTransactionOnline";
import CurrentTransactionCash from "./Pages/CurrentTransactionCash/CurrentTransactionCash";
import CurrentVerifiedDriver from "./Pages/CurrentVerifiedDriver/CurrentVerifiedDriver";
import CurrentUnVerifiedDriver from "./Pages/Current-Un-VerifiedDriver/CurrentUnVerifiedDriver";
import CurrentCategory from "./Pages/CurrentCategory/CurrentCategory";

const App = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const dispatch = useDispatch();
  useEffect(() => {
    const RefreshToken = localStorage.getItem("RefreshToken");
    if (!RefreshToken) return; // If no RefreshToken, don't proceed further

    async function reLogin() {
      try {
        const user = await FetchData("admins/re-login", "post", {
          RefreshToken,
        });

        // Clear localStorage and set new tokens
        localStorage.clear(); // will clear all the data from localStorage
        localStorage.setItem("AccessToken", user.data.data.tokens.AccessToken);
        localStorage.setItem(
          "RefreshToken",
          user.data.data.tokens.RefreshToken
        );

        // Storing data inside redux store
        dispatch(clearUser());
        dispatch(addUser(user.data.data.user));
        return user;
      } catch (error) {
        console.log(error);
        alert(parseErrorMessage(error));
      }
    }

    reLogin();
  }, []);

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when the component mounts
  }, [dispatch]);

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-cyan-900 font-Fredoka no-scrollbar">
      <div className="text-black">
        <Header />
        <Routes>
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/" element={<AdminLogin />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/current-user/:userId" element={<CurrentUser />} />
          <Route
            path="/current-product/:productId"
            element={<CurrentProduct />}
          />
          <Route path="/current-order/:orderId" element={<CurrentOrder />} />
          <Route
            path="/current-category/:categoryId"
            element={<CurrentCategory />}
          />
          <Route
            path="/current-transaction-detail/:transactionId"
            element={<CurrentTransactionOnline />}
          />
          <Route
            path="/current-cash-transaction-detail/:transactionId"
            element={<CurrentTransactionCash />}
          />
          <Route
            path="/current-verified-vendor/:vendorId"
            element={<CurrentVerifiedVendor />}
          />
          <Route
            path="/current-un-verified-vendor/:vendorId"
            element={<CurrentUnVerifiedVendor />}
          />
          <Route
            path="/current-verified-driver/:driverId"
            element={<CurrentVerifiedDriver />}
          />
          <Route
            path="/current-un-verified-driver/:driverId"
            element={<CurrentUnVerifiedDriver />}
          />
          <Route path="/promotions" element={<Promotion />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
