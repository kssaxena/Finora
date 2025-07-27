import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/Loading";

const VerifiedDrivers = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState(null);
  const [allDrivers, setAllDrivers] = useState([]);

  // Fetching all verified drivers from the API
  useEffect(() => {
    const fetchAllDrivers = async () => {
      try {
        startLoading();
        const response = await FetchData(`driver/registration-request`, "get");
        console.log(response);
        if (response.data.success) {
          setAllDrivers(response.data.orders);
        } else {
          setError("Failed to load orders.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        stopLoading();
      }
    };
    fetchAllDrivers();
  }, []);

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Un-Verified partners
      </h2>
      {/* Detailed Driver List */}
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Delivery-partner ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Number</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Vehicle</th>
                <th className="py-2 px-4 border-b">Verification Status</th>
                <th className="py-2 px-4 border-b">Button</th>
              </tr>
            </thead>
            <tbody>
              {allDrivers?.length > 0 ? (
                allDrivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{driver?._id}</td>
                    <td className="py-2 px-4 border-b">{driver?.name}</td>
                    <td className="py-2 px-4 border-b">
                      {driver?.number || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {driver.address || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {driver.vehicleDetails.vehicleType}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {driver.verificationStatus}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-2 px-4 text-center">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(VerifiedDrivers);
