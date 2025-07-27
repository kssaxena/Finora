import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";

const Users = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [allUser, setAllUsers] = useState([]);
  const tableHeadersUsers = ["ID", "Name", "Email", "Contact No."];
  const [searchTermUser, setSearchTermUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUser);

  const handleSearchUser = (e) => {
    const searchValueUser = e.target.value;
    setSearchTermUser(searchValueUser);

    if (searchValueUser === "") {
      setFilteredUsers(allUser);
    } else {
      const filtered = allUser.filter(
        (user) =>
          user._id.includes(searchValueUser) ||
          user.phoneNumber.includes(searchValueUser) ||
          user.name.toLowerCase().includes(searchValueUser)
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    setFilteredUsers(allUser);
  }, [allUser]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData("users/admin/get-all-users", "get");
          // console.log(response);
          if (response.data.success) {
            setAllUsers(response.data.data.users);
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

    fetchAllUsers();
  }, [user]);
  return (
    <section className="">
      {/* main component */}
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {/* sorting box */}
      <div className="mb-4">
        <InputBox
          Type="test"
          Value={searchTermUser}
          onChange={handleSearchUser}
          Placeholder={"Search by ID or Contact Number"}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersUsers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-500 px-4 py-2 bg-neutral-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-user/${user._id}`}
                    >
                      {user?._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {user?.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {user?.email}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {user?.phoneNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersUsers.length}
                  className="text-center py-4"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(Users);
