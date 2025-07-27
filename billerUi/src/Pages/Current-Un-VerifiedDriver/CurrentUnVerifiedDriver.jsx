import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentUnVerifiedDriver = ({ startLoading, stopLoading }) => {
  const { driverId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentDriver, setCurrentDriver] = useState([]);
  const [currentDriverAadhar, setCurrentDriverAadhar] = useState([]);
  const [currentDriverDrivingLicense, setCurrentDriverDrivingLicense] =
    useState([]);
  const [currentDriverPan, setCurrentDriverPan] = useState([]);
  const [currentDriverVehicleDetails, setCurrentDriverVehicleDetails] =
    useState([]);

  useEffect(() => {
    const fetchDriver = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(`driver/driver/${driverId}`, "get");
          console.log(response);
          if (response.data.success) {
            setCurrentDriver(response.data.data);
            setCurrentDriverAadhar(response.data.data.aadhar);
            setCurrentDriverDrivingLicense(response.data.data.drivingLicense);
            setCurrentDriverPan(response.data.data.pan);
            setCurrentDriverVehicleDetails(response.data.data.vehicleDetails);
          } else {
            setError("Failed to load Drivers.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch Drivers.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchDriver();
  }, [user]);

  const AcceptRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `driver/driver-request/${driverId}`,
        "patch"
      );

      // console.log(response);
      alert("Driver Accepted!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };
  const RejectRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `driver/driver-request/${driverId}`,
        "delete"
      );

      // console.log(response);
      alert("Driver rejected!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const details = [
    { label: "Driver ID", value: currentDriver?._id },
    { label: "Contact Number", value: currentDriver?.number },
    // { label: "Owner Email", value: currentDriver?.email },
    { label: " Name", value: currentDriver?.name },
    {
      label: "Aadhar Number",
      value: currentDriverAadhar?.number,
    },
    {
      label: "Driving License Details",
      value: (
        <div className="flex justify-start items-center gap-5">
          <span>{currentDriverDrivingLicense?.number}</span>
          {/* <span>{currentDriverDrivingLicense?.image.url}</span> */}
          <img
            src={currentDriverDrivingLicense?.image?.url}
            className="w-40 shadow-lg"
          />
        </div>
      ),
    },
    {
      label: "PAN Details",
      value: (
        <div className="flex justify-start items-center gap-5">
          <span>{currentDriverPan?.number}</span>
          {/* <span>{currentDriverPan?.image.url}</span> */}
          <img src={currentDriverPan?.image?.url} className="w-40 shadow-lg" />
        </div>
      ),
    },
    {
      label: "Vehicle registration certificate (RC)",

      value: (
        <div className="flex justify-start items-center gap-5">
          <span>{currentDriverVehicleDetails?.number}</span>
          {/* <span>{currentDriverVehicleDetails?.image.url}</span> */}
          <img
            src={currentDriverVehicleDetails?.RAC?.back?.url}
            className="w-40 shadow-lg"
          />
          <img
            src={currentDriverVehicleDetails?.RAC?.front?.url}
            className="w-40 shadow-lg"
          />
        </div>
      ),
    },
    {
      label: "Vehicle Insurance details",

      value: (
        <div className="flex justify-start items-center gap-5">
          <span>{currentDriverVehicleDetails?.number}</span>
          {/* <span>{currentDriverVehicleDetails?.image.url}</span> */}
          <img
            src={currentDriverVehicleDetails?.insurance?.image?.url}
            className="w-40 shadow-lg"
          />
        </div>
      ),
    },
    {
      label: "Vehicle Plate Number",
      value: currentDriverVehicleDetails?.plateNumber,
    },
    {
      label: "Vehicle Type",
      value: currentDriverVehicleDetails?.vehicleType,
    },
    {
      label: "Vehicle Model",
      value: currentDriverVehicleDetails?.vehicleModel,
    },
    // {
    //   label: "Store Location",
    //   value: (
    //     <div>
    //       <span className="font-bold ">Address:</span>{" "}
    //       {/* {currentVendorAddressDetails?.address} */}
    //       <br />
    //       <span className="font-bold ">City:</span>{" "}
    //       {/* {currentVendorAddressDetails?.city} */}
    //       <br />
    //       <span className="font-bold ">State:</span>{" "}
    //       {/* {currentVendorAddressDetails?.state} */}
    //       <br />
    //       <span className="font-bold ">Country: </span>{" "}
    //       {/* {currentVendorAddressDetails?.country} */}
    //       <br />
    //       <span className="font-bold ">Postal Code:</span>{" "}
    //       {/* {currentVendorAddressDetails?.postalCode} */}
    //     </div>
    //   ),
    // },
    // {
    //   label: "Business Details",
    //   value: (
    //     <div>
    //       <div>
    //         <span className="font-bold ">Business Name:</span>{" "}
    //         {/* {currentVendorBusinessDetails?.businessName} */}
    //       </div>
    //       <div>
    //         <span className="font-bold ">GST Number:</span>{" "}
    //         {/* {currentVendorBusinessDetails?.gstNumber} */}
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   label: "Bank Details",
    //   value: (
    //     <div>
    //       <span className="font-bold ">Account Holder Name:</span>{" "}
    //       {/* {currentVendorBankDetails?.accountHolderName} */}
    //       <br />
    //       <span className="font-bold ">Account Number:</span>{" "}
    //       {/* {currentVendorBankDetails?.accountNumber} */}
    //       <br />
    //       <span className="font-bold ">Bank Name:</span>{" "}
    //       {/* {currentVendorBankDetails?.bankName} */}
    //       <br />
    //       <span className="font-bold ">IFSC Code:</span>{" "}
    //       {/* {currentVendorBankDetails?.ifscCode} */}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div className="flex justify-center items-center gap-20">
        <h2 className="">
          Driver name:
          <span className="text-2xl font-semibold ml-2">
            {currentDriver?.name}
          </span>
        </h2>
        <h1>
          Id:{" "}
          <span className="text-2xl font-semibold">{currentDriver?._id}</span>
        </h1>
        <Button
          label={"Accept Partner"}
          // className={"hover:bg-red-500"}
          onClick={AcceptRequest}
        />
        <Button
          label={"Reject Partner"}
          className={"hover:bg-red-500"}
          onClick={RejectRequest}
        />
      </div>
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg mt-10">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Driver Details
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

export default LoadingUI(CurrentUnVerifiedDriver);
