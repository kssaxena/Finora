import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";

const VendorUnderReview = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);

  const [allUnverifiedVendors, setAllUnverifiedVendors] = useState([]);
  const tableHeadersVendors = [
    "Vendor ID",
    "Name",
    "Email",
    "Contact No.",
    "Total Products",
  ];

  const [searchTermUnVerifiedVendors, setSearchTermUnVerifiedVendors] =
    useState("");
  const [filteredUnVerifiedVendors, setFilteredUnVerifiedVendors] =
    useState(allUnverifiedVendors);

  const handleSearchUnVerifiedVendors = (e) => {
    const searchValueUnVerifiedVendors = e.target.value;
    setSearchTermUnVerifiedVendors(searchValueUnVerifiedVendors);

    if (searchValueUnVerifiedVendors === "") {
      setFilteredUnVerifiedVendors(allUnverifiedVendors);
    } else {
      const filtered = allUnverifiedVendors.filter(
        (vendor) =>
          vendor._id.includes(searchValueUnVerifiedVendors) ||
          vendor.contactNumber.includes(searchValueUnVerifiedVendors) ||
          vendor.name.toLowerCase().includes(searchValueUnVerifiedVendors)
      );
      setFilteredUnVerifiedVendors(filtered);
    }
  };

  useEffect(() => {
    setFilteredUnVerifiedVendors(allUnverifiedVendors);
  }, [allUnverifiedVendors]);

  useEffect(() => {
    const fetchAllUnVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "vendor/admin/get-all-unverified-vendor",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllUnverifiedVendors(response.data.data.vendor);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllUnVerifiedVendors();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Vendors (UnVerified)</h2>
      <InputBox
        Type="test"
        Value={searchTermUnVerifiedVendors}
        onChange={handleSearchUnVerifiedVendors}
        Placeholder={"Search by Vendor Name, Vendor ID, Mobile number"}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersVendors.map((header, index) => (
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
            {filteredUnVerifiedVendors?.length > 0 ? (
              filteredUnVerifiedVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-un-verified-vendor/${vendor?._id}`}
                    >
                      {vendor?._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {vendor?.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {vendor?.email}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {vendor?.contactNumber}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {vendor?.products?.length}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersVendors.length}
                  className="text-center py-4"
                >
                  No Vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(VendorUnderReview);
