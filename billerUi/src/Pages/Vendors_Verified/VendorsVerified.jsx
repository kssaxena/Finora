import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const VendorsVerified = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allVerifiedVendors, setAllVerifiedVendors] = useState([]);
  const tableHeadersVendors = [
    "Vendor ID",
    "Name",
    "Email",
    "Contact No.",
    "Total Products",
  ];
  const [searchTermVerifiedVendors, setSearchTermVerifiedVendors] =
    useState("");
  const [filteredVerifiedVendors, setFilteredVerifiedVendors] =
    useState(allVerifiedVendors);
  const handleSearchVerifiedVendors = (e) => {
    const searchValueVerifiedVendors = e.target.value;
    setSearchTermVerifiedVendors(searchValueVerifiedVendors);

    if (searchValueVerifiedVendors === "") {
      setFilteredVerifiedVendors(allVerifiedVendors);
    } else {
      const filtered = allVerifiedVendors.filter(
        (vendor) =>
          vendor._id.includes(searchValueVerifiedVendors) ||
          vendor.contactNumber.includes(searchValueVerifiedVendors) ||
          vendor.name.toLowerCase().includes(searchValueVerifiedVendors)
      );
      setFilteredVerifiedVendors(filtered);
    }
  };
  useEffect(() => {
    setFilteredVerifiedVendors(allVerifiedVendors);
  }, [allVerifiedVendors]);

  useEffect(() => {
    const fetchAllVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "vendor/admin/get-all-verified-vendor",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllVerifiedVendors(response.data.data.vendor);
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

    fetchAllVerifiedVendors();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Vendors (Verified)</h2>
      {/* Vendors (Verified) content */}
      <InputBox
        Type="test"
        Value={searchTermVerifiedVendors}
        onChange={handleSearchVerifiedVendors}
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
            {filteredVerifiedVendors?.length > 0 ? (
              filteredVerifiedVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-verified-vendor/${vendor?._id}`}
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

export default LoadingUI(VendorsVerified);
