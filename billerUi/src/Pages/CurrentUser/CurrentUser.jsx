import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentUser = ({ startLoading, stopLoading }) => {
  const { userId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [currentUserAddress, setCurrentUserAddress] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `users/admin/get-current-user/${userId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setCurrentUser(response.data.data.user);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };

    const fetchAllAddress = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `users/admin/${userId}/addresses`,
            "get"
          );
          console.log(response);
          if (response.statusText) {
            setCurrentUserAddress(response.data);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllOrders();
    fetchAllAddress();
  }, [user]);

  const HandleUserBan = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `users/admin/ban-user/${userId}`,
        "post"
      );
      console.log(response);
      if (response.statusText) {
        alert("User Banned Successfully");
      } else {
        alert("Failed to ban user");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to ban user");
    } finally {
      stopLoading();
    }
  };

  console.log(currentUserAddress);

  const details = [
    { label: "Email", value: currentUser?.email },
    { label: "Name", value: currentUser?.name },
    { label: "Contact Number", value: currentUser?.phoneNumber },
    { label: "Account Created On", value: currentUser?.createdAt },
    { label: "Total Address Stored", value: currentUser?.address?.length },
    {
      label: "Total Address Stored",
      value: (
        <div>
          {currentUserAddress.map((address, index) => (
            <div key={index}>
              <span className="font-bold text-gray-800">
                Address {index + 1}:
              </span>
              <p className="font-bold">
                Street: <span className="font-normal">{address.street}</span>
                <br></br>
                City: <span className="font-normal">{address.city}</span>
                <br></br>
                State: <span className="font-normal">{address.state}</span>
                <br></br>
                Country: <span className="font-normal">{address.country}</span>
                <br></br>
                Pin Code:{" "}
                <span className="font-normal">{address.postalCode}</span>
              </p>
            </div>
          ))}
        </div>
      ),
    },
    { label: "Total Orders", value: currentUser?.totalOrders },
    { label: "Total Cart Products", value: currentUser?.CartProducts?.length },
    { label: "Total Wishlist Products", value: currentUser?.WishList?.length },
  ];
  return (
    <div className="">
      <div className="flex justify-center items-center gap-10 pb-5">
        <Button label={"Ban User"} onClick={HandleUserBan} />
        {/* <Button label={"Edit User"} /> */}
        <div>
          <h1>
            User Id:{" "}
            <span className="text-xl font-bold">{currentUser?._id}</span>
          </h1>
        </div>
      </div>
      {/* <h1>current User</h1> */}
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Contents
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Information
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-gray-700 font-medium">
                    {item.label}
                  </td>
                  <td className="border px-4 py-2 text-gray-800">
                    {item.value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentUser);
