import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";

const Orders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allOrders, setAllOrders] = useState([]);
  const tableHeadersOrder = [
    "Order ID",
    "User ID",
    "Price",
    "Status",
    "Placed On",
  ];

  const [searchTermOrders, setSearchTermOrders] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.bookingDate);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
    setFilteredOrders(filtered);
  };

  const handleSearchOrder = (e) => {
    const searchValueOrder = e.target.value;
    setSearchTermOrders(searchValueOrder);

    if (searchValueOrder === "") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (order) =>
          order._id.includes(searchValueOrder) ||
          order.user.includes(searchValueOrder)
      );
      setFilteredOrders(filtered);
    }
  };

  const handleSortByDate = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.bookingDate);
      const dateB = new Date(b.bookingDate);
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
  };

  useEffect(() => {
    // Whenever allOrders changes, reset sorting
    setFilteredOrders(allOrders);
    setSortOrder("desc");
  }, [allOrders]);

  // useEffect(() => {
  //   setFilteredOrders(allOrders);
  // }, [allOrders]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData("orders/admin/all-orders", "get");
          // console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.data.orders);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to Products");
        } finally {
          stopLoading();
        }
      }
    };

    // fetchAllProducts();
    fetchAllOrders();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermOrders}
          onChange={handleSearchOrder}
          Placeholder={"Search by Product ID or Vendor ID"}
        />
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <div className="flex gap-2 items-center">
            <label className="font-medium">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-medium">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredOrders(allOrders);
            }}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl h-screen">
          <thead>
            <tr>
              {tableHeadersOrder.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-500 px-4 py-2 bg-neutral-300"
                >
                  {header}
                  {header === "Placed On" && (
                    <button
                      className="ml-2 text-xs underline text-blue-600"
                      onClick={handleSortByDate}
                      type="button"
                    >
                      Sort {sortOrder === "asc" ? "Newest" : "Oldest"}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-order/${order._id}`}
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order?.user}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.totalAmount}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.orderStatus}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.bookingDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersOrder.length}
                  className="text-center py-4"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(Orders);
