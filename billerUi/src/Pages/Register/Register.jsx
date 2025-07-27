import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";

const AdminRegister = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const HandleLogin = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      startLoading()
      const response = await FetchData(
        `admins/admin-register`,
        "post",
        formData
      );
      console.log(response);
      if (response.data.success) {
        alert("Registered successfully");
        HandleLogin();
      } else {
        setError("Failed to register.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register.");
    } finally {
      stopLoading()
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, register yourself as Admin
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <InputBox
          LabelName="Name"
          Name="name"
          Value={formData.name}
          Placeholder="Enter Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={formData.email}
          Placeholder="Enter Email"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Password"
          Type="password"
          Name="password"
          Value={formData.password}
          Placeholder="Enter Password"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Contact Number"
          Name="phoneNumber" // updated name
          Value={formData.phoneNumber} // updated value
          Placeholder="Enter Contact Number"
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <Button label={"Register"} Type={"submit"} className={"w-full"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(AdminRegister);
