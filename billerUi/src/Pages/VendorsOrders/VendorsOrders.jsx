import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import InputBox from "../../Components/InputBox";
import LoadingUI from "../../Components/Loading";
import { Link } from "react-router";
import Button from "../../Components/Button";
// import { ExportExcelWithHeadersAndTitle, exportStyledExcel } from "../../Utility/ExportExcel";
import { exportStyledExcel } from "../../Utility/ExportExcel";

const VendorsOrders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allOrders, setAllOrders] = useState([]);
  const [error, setError] = useState("");
  //   const [today, setToday] = useState("");
  //   const [oneWeekAgo, setOneWeekAgo] = useState("");
  const formRef = useRef(null);
  const tableHeadersOrder = [
    "Vendor ID",
    "Vendor Name",
    "Account Number",
    "All orders",
    "Total Payable Amount",
  ];

  const [searchTermOrders, setSearchTermOrders] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);

  const handleSearchOrder = (e) => {
    const searchTermOrders = e.target.value;
    setSearchTermOrders(searchTermOrders);

    if (searchTermOrders === "") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (order) =>
          order._id.includes(searchTermOrders) ||
          order.name.includes(searchTermOrders)
      );
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    setFilteredOrders(allOrders);
  }, [allOrders]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const formData = new FormData(formRef.current);
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
          const response = await FetchData(
            "orders/admin/get-vendor-orders-report",
            "post",
            formData
          );
          console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          console.log(err);
          //   setError(err.response?.data?.message || "Failed to Products");
        } finally {
          stopLoading();
        }
      }
    };

    // fetchAllProducts();
    fetchAllOrders();
  }, [user]);

  function prepareVendorPayoutData(vendorData) {
    return vendorData.map((vendor) => {
      const vendorDetails = vendor.vendorDetails[0];
      const bankDetails = vendorDetails.bankDetails || {};

      // Calculate commission (assuming 10% for example, adjust as needed)
      const commissionPercentage = 10; // You can modify this or fetch from vendor data
      const commissionAmount =
        (vendor.totalPayableAmount * commissionPercentage) / 100;
      const netPayable = vendor.totalPayableAmount - commissionAmount;

      return {
        "Vendor ID": vendorDetails._id,
        "Vendor Name": vendorDetails.name,
        Email: vendorDetails.email,
        Phone: vendorDetails.contactNumber,
        "Bank Name": bankDetails.bankName || "N/A",
        "Account No.": bankDetails.accountNumber || "N/A",
        IFSC: bankDetails.ifscCode || "N/A",
        "Total Orders": vendor.Orders.length,
        "Gross Sales": vendor.totalPayableAmount,
        "Commission (%)": commissionPercentage,
        "Commission Amt": commissionAmount,
        "Net Payable": netPayable,
        "Payout Status": "Pending", // Default status, can be updated dynamically
        "Payout Date": "N/A", // Can be filled when payout is processed
      };
    });
  }

  const handleDownloadExcel = async (e) => {
    e.preventDefault();

    const excelHeader = [
      "Vendor ID",
      "Vendor Name",
      "Email",
      "Phone",
      "Bank Name",
      "Account No.",
      "IFSC",
      "Total Orders",
      "Gross Sales",
      "Commission (%)",
      "Commission Amt",
      "Net Payable",
      "Payout Status",
      "Payout Date",
    ];

    const data = prepareVendorPayoutData(allOrders);
    console.log(data);
    await exportStyledExcel(
      data,
      "Vendors Payout",
      excelHeader,
      "Vendors Payout Report"
    );
  };

  const today = new Date().toISOString().split("T")[0];
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const oneWeekAgo = lastWeek.toISOString().split("T")[0];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermOrders}
          onChange={handleSearchOrder}
          Placeholder={"Search by Vendor ID, Vendor Name or Account Number"}
        />
        <form ref={formRef} className=" flex justify-start items-center">
          <div className="flex gap-4 mx-auto p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date One Week Ago
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="startDate"
                defaultValue={oneWeekAgo}
                // value={oneWeekAgo}
                // onChange={(e) => setOneWeekAgo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Today's Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="endDate"
                defaultValue={today}
                // value={today}
                // onChange={(e) => setToday(e.target.value)}
              />
            </div>
          </div>
          <Button label={"Download sheet"} onClick={handleDownloadExcel} />
        </form>
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersOrder.map((header, index) => (
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <td
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-order/${order._id}`}
                    >
                      {order.vendorDetails[0]._id}
                    </td>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.vendorDetails[0].name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.vendorDetails[0].bankDetails.accountNumber}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.Orders.length}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.totalPayableAmount}
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

export default LoadingUI(VendorsOrders);
