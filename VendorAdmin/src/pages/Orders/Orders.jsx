import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import LoadingUI from "../../components/Loading";

const Orders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [sortedOrders, setSortedOrders] = useState([]);

  useEffect(() => {
    setSortedOrders(allOrders);
  }, [allOrders]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSort = () => {
    if (!selectedDate) {
      setSortedOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.updatedAt).toISOString().split("T")[0];
      return orderDate === selectedDate;
    });
    setSortedOrders(filtered);
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/get-vendor-orders/${user?.[0]?._id}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.orders);
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
  }, [user]);
  // console.log(user?.[0]?._id);

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  console.log(allOrders);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg  h-screen overflow-scroll">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Orders</h2>
      <div className="flex items-center mb-4 gap-2">
        <label htmlFor="date" className="font-medium">
          Sort by Date:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleSort}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Sort
        </button>
        {selectedDate && (
          <button
            onClick={() => {
              setSelectedDate("");
              setSortedOrders(allOrders);
            }}
            className="ml-2 text-sm text-gray-600 underline"
          >
            Clear
          </button>
        )}
      </div>
      {/* Detailed Order List */}
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">
                  Category ID / Subcategory ID
                </th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">MRP</th>
                <th className="py-2 px-4 border-b">Sold at</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Placed At</th>
                {/* <th className="py-2 px-4 border-b">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{order._id}</td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.product.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b truncate">
                      Category ID:{" "}
                      <span className="text-xs">
                        {order.products[0]?.product.category || "N/A"}
                      </span>{" "}
                      <br />
                      Subcategory ID:
                      <span className="text-xs">
                        {order.products[0]?.product.subcategory || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.quantity}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.MRP}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.sellingPrice}
                    </td>
                    <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                    <td className="py-2 px-4 border-b">
                      {order.paymentStatus}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {new Date(order.updatedAt).toLocaleDateString()}
                      {/* {order.updatedAt} */}
                    </td>
                    {/* <td className="py-2 px-4 border-b">
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        View
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-2 px-4 text-center">
                    No orders found.
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

export default LoadingUI(Orders);
