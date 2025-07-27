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

  const BanDriver = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(`driver/ban-driver/${driverId}`, "post");

      // console.log(response);
      alert("Driver banned!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };
  const ToggleSuspendDriver = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `driver/toggle-suspension/${driverId}`,
        "patch"
      );

      // console.log(response);
      alert("Driver suspended!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };
  const ToggleDeleteDriver = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(`driver/driver/${driverId}`, "delete");

      // console.log(response);
      alert("Driver deleted!");
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
    {
      label: "Partner verification status",
      value: currentDriver?.verificationStatus,
    },
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
          label={"Ban Partner"}
          className={"hover:bg-red-500"}
          onClick={BanDriver}
        />
        <Button
          label={"Suspend Partner"}
          className={"hover:bg-red-500"}
          onClick={ToggleSuspendDriver}
        />
        <Button
          label={"Delete Partner"}
          className={"hover:bg-red-500"}
          onClick={ToggleDeleteDriver}
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
