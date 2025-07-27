import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser } from "../../Utility/Slice/UserInfoSlice";
import LoadingUI from "../../Components/Loading";
import BackGround from "../../assets/HomeBackground.jpg";
import LOGO from "../../assets/Logo.png";

const AdminLogin = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      startLoading();
      const response = await FetchData(`admins/admin-login`, "post", formData);
      console.log(response);
      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.AccessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.RefreshToken
      );

      alert(response.data.message);
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      setSuccess("Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to Login.");
    } finally {
      stopLoading(); // Stop loading once response is received
    }
  };

  return user.length > 0 ? (
    navigate("/home")
  ) : (
    <div className="absolute top-0 left-0 w-full h-full ">
      <img src={BackGround} />
      <div className="max-w-4xl mx-auto p-6 shadow-2xl rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-fit backdrop-blur-sm">
        <div className="flex justify-center items-center w-full ">
          <img src={LOGO} className="w-20" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome, Login yourself as Rider's Kart E-com Admin
        </h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputBox
            classNameLabel="text-black"
            LabelName="Email"
            Type="email"
            Name="email"
            Value={formData.email}
            Placeholder="Enter Email"
            onChange={handleChange}
          />
          <InputBox
            classNameLabel="text-black"
            LabelName="Password"
            Type="password"
            Name="password"
            Value={formData.password}
            Placeholder="Enter Password"
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <Button label={"Login"} Type={"submit"} className={"w-full"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoadingUI(AdminLogin);
