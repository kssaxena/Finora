import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { ArrowDownToLine } from "lucide-react";

const CurrentUnVerifiedVendor = ({ startLoading, stopLoading }) => {
  const { vendorId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentVendor, setCurrentVendor] = useState([]);
  const [currentVendorBankDetails, setCurrentVendorBankDetails] = useState([]);
  const [currentVendorBusinessDetails, setCurrentVendorBusinessDetails] =
    useState([]);
  const [currentVendorAddressDetails, setCurrentVendorAddressDetails] =
    useState([]);
  const [currentVendorProducts, setCurrentVendorProducts] = useState([]);
  const [currentVendorGST, setCurrentVendorGST] = useState();

  useEffect(() => {
    const fetchVendor = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `vendor/admin/get-current-vendor/${vendorId}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setCurrentVendor(response.data.data.vendor);
            setCurrentVendorGST(response.data.data.vendor.image);
            setCurrentVendorBankDetails(response.data.data.vendor.bankDetails);
            setCurrentVendorBusinessDetails(
              response.data.data.vendor.businessDetails
            );
            setCurrentVendorAddressDetails(response.data.data.vendor.location);
            setCurrentVendorProducts(response.data.data.vendor.products);
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

    fetchVendor();
  }, [user]);

  const details = [
    { label: "Vendor ID", value: currentVendor?._id },
    { label: "Contact Number", value: currentVendor?.contactNumber },
    { label: "Owner Email", value: currentVendor?.email },
    { label: "Owner Name", value: currentVendor?.name },
    {
      label: "Vendor Registered Products",
      value: currentVendorProducts?.length,
    },
    {
      label: "Store Location",
      value: (
        <div>
          <span className="font-bold ">Address:</span>{" "}
          {currentVendorAddressDetails?.address}
          <br />
          <span className="font-bold ">City:</span>{" "}
          {currentVendorAddressDetails?.city}
          <br />
          <span className="font-bold ">State:</span>{" "}
          {currentVendorAddressDetails?.state}
          <br />
          <span className="font-bold ">Country: </span>{" "}
          {currentVendorAddressDetails?.country}
          <br />
          <span className="font-bold ">Postal Code:</span>{" "}
          {currentVendorAddressDetails?.postalCode}
        </div>
      ),
    },
    {
      label: "Business Details",
      value: (
        <div>
          <div>
            <span className="font-bold ">Business Name:</span>{" "}
            {currentVendorBusinessDetails?.businessName}
          </div>
          <div>
            <span className="font-bold ">GST Number:</span>{" "}
            {currentVendorBusinessDetails?.gstNumber}
          </div>
        </div>
      ),
    },
    {
      label: "Bank Details",
      value: (
        <div>
          <span className="font-bold ">Account Holder Name:</span>{" "}
          {currentVendorBankDetails?.accountHolderName}
          <br />
          <span className="font-bold ">Account Number:</span>{" "}
          {currentVendorBankDetails?.accountNumber}
          <br />
          <span className="font-bold ">Bank Name:</span>{" "}
          {currentVendorBankDetails?.bankName}
          <br />
          <span className="font-bold ">IFSC Code:</span>{" "}
          {currentVendorBankDetails?.ifscCode}
        </div>
      ),
    },
    {
      label: "GST Certificate",
      value: (
        <div className="flex justify-center items-start">
          <img src={currentVendorGST?.url} className="h-[40vh]" />
          {/* <Button label={<ArrowDownToLine />} /> */}
        </div>
      ),
    },
    {
      label: "Canceled Cheque",
      value: (
        <div className="flex justify-center items-start">
          <img src={currentVendor?.canceledCheque?.url} className="h-[40vh]" />
          {/* <Button label={<ArrowDownToLine />} /> */}
        </div>
      ),
    },
  ];

  const RejectRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `vendor/admin/reject-vendor/${vendorId}`,
        "get"
      );

      console.log(response);
      alert("Vendor rejected!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const AcceptRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `vendor/admin/accept-vendor/${vendorId}`,
        "get"
      );

      console.log(response);
      alert("Vendor Accepted!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-20">
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentVendor?.name}
        </h2>
        <h1>
          Id:{" "}
          <span className="text-2xl font-semibold">{currentVendor?._id}</span>
        </h1>

        <Button label={"Accept Vendor"} onClick={AcceptRequest} />
        <Button
          label={"Reject Vendor"}
          onClick={RejectRequest}
          className={"hover:bg-red-500"}
        />
      </div>
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg mt-10">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Vendor Details
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Information
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-gray-700 font-bold">
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

export default LoadingUI(CurrentUnVerifiedVendor);
