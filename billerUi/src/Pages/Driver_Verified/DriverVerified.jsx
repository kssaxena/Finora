import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import { X } from "lucide-react";
import RegisterDriver from "./DriverRegister";
import { FetchData } from "../../Utility/FetchFromApi";

const DriversVerified = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const [allDrivers, setAllDrivers] = useState([]);
  const tableHeadersDrivers = [
    "Driver ID",
    "Vendor name",
    "Driver name",
    "Contact Number",
    "Added On",
    "Status",
  ];
  const [searchTermDrivers, setSearchTermDrivers] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState(allDrivers);

  const handleSearchDrivers = (e) => {
    const searchValueDrivers = e.target.value.toLowerCase();
    setSearchTermDrivers(searchValueDrivers);

    if (searchValueDrivers === "") {
      setFilteredDrivers(allDrivers);
    } else {
      const filtered = allDrivers.filter(
        (order) =>
          order._id.toLowerCase().includes(searchValueDrivers) ||
          order.name.toLowerCase().includes(searchValueDrivers) ||
          order.vendorId.name.toLowerCase().includes(searchValueDrivers)
      );
      setFilteredDrivers(filtered);
    }
  };

  useEffect(() => {
    setFilteredDrivers(allDrivers);
  }, [allDrivers]);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData("driver/verified-drivers", "get");
          if (response.data.success) {
            setAllDrivers(response.data.data);
          } else {
            setError("Failed to load Drivers.");
          }
        } catch (err) {
          console.log(err);
        } finally {
          stopLoading();
        }
      }
    };

    fetchDrivers();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermDrivers}
          onChange={handleSearchDrivers}
          Placeholder={"Search by Driver name"}
        />
        <Button
          label={"Add new delivery partner"}
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="flex justify-centre items-start absolute top-0 left-0 h-screen w-full bg-black/70 backdrop-blur-sm overflow-scroll z-50">
            <Button
              label={<X />}
              onClick={() => setIsOpen(false)}
              className={"fixed top-0 left-0"}
            />
            <RegisterDriver />
          </div>
        )}

        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersDrivers.map((header, index) => (
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
            {filteredDrivers?.length > 0 ? (
              filteredDrivers?.map((driver) => (
                <tr key={driver._id}>
                  <td className="border border-gray-500 px-4 py-2 hover:text-blue-500 underline-blue-500 hover:underline cursor-pointer">
                    <Link to={`/current-verified-driver/${driver._id}`}>
                      {driver._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {driver?.vendorId.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {driver?.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {driver.number}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {driver.createdAt}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {driver.verificationStatus}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersDrivers.length}
                  className="text-center py-4"
                >
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(DriversVerified);
