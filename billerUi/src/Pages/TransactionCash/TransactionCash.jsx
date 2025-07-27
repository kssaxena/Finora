import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { useRef } from "react";

const TransactionCash = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [allPayments, setAllPayments] = useState([]);
  const tableHeadersPayment = [
    "Transaction ID",
    "Delivery Partner ID",
    "Price",
    "Payment mode",
    "Placed On",
  ];

  const [searchTermPayments, setSearchTermPayments] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(allPayments);

  const handleSearchPayment = (e) => {
    const searchValuePayment = e.target.value;
    setSearchTermPayments(searchValuePayment);

    if (searchValuePayment === "") {
      setFilteredPayments(allPayments);
    } else {
      const filtered = allPayments.filter(
        (payment) => payment._id.includes(searchValuePayment)
        //   payment.user.includes(searchValuePayment)
      );
      setFilteredPayments(filtered);
    }
  };

  useEffect(() => {
    setFilteredPayments(allPayments);
  }, [allPayments]);

  useEffect(() => {
    const fetchAllTransaction = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "orders/admin/cash-on-delivery-orders",
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setAllPayments(response.data.orders);
          } else {
            setError("Failed to fetch transactions.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch transactions"
          );
        } finally {
          stopLoading();
        }
      }
    };

    // fetchAllProducts();
    fetchAllTransaction();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Cash Payments</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermPayments}
          onChange={handleSearchPayment}
          Placeholder={"Search by Transaction ID..."}
        />
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersPayment.map((header, index) => (
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
            {filteredPayments?.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-cash-transaction-detail/${payment._id}`}
                    >
                      {payment._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {payment?.user}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {payment.totalAmount}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {payment.paymentMethod}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {payment.bookingDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersPayment.length}
                  className="text-center py-4"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(TransactionCash);
