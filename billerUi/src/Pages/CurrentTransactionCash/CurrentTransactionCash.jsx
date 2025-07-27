import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import LoadingUI from "../../Components/Loading";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";

const CurrentTransactionCash = ({ startLoading, stopLoading }) => {
  const { transactionId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentTransaction, setCurrentTransaction] = useState([]);
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/admin/current-order/${transactionId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setCurrentTransaction(response.data.data);
            setOrder(response.data.data.order);
            setProduct(response.data.data.order.products);
          } else {
            setError("Failed to load transaction details.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch transaction details."
          );
        } finally {
          stopLoading();
        }
      }
    };

    fetchTransactions();
  }, [user]);

  // console.log(order);

  const handleDeleteProduct = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/admin/single-product/${productId}`,
        "delete"
      );
      // console.log(response);
      if (response.data) {
        alert(response.data.message);
        handleHome();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-evenly items-center flex-col">
      <div>
        {/* <h2>
          Vendor Id:{" "}
          <span className="text-xl font-bold">
            {currentTransaction?.vendor?._id}
          </span>
        </h2> */}
        <h1>
          Current Transaction Id:{" "}
          <span className="text-xl font-bold">{order?._id}</span>
        </h1>
        <div className="flex justify-evenly items-center gap-5 py-10">
          <Button
            label={"Process settlement"}
            // onClick={handleDeleteProduct}
            className={"hover:bg-green-500"}
          />
          <Button
            label={"Hold settlement"}
            // onClick={handleDeleteProduct}
            className={"hover:bg-red-500"}
          />
        </div>
      </div>
      <div className="flex justify-evenly items-center px-4 py-10 bg-white shadow-m rounded-xl w-full ">
        <div className="w-full flex justify-center flex-col items-center">
          <h1 className="text-center text-2xl mb-10 font-semibold">
            Transaction Description
          </h1>
          {[
            // {
            //   label: "Name",
            //   value: currentTransaction?.name || "No data found",
            // },
            {
              label: "Payment Method",
              value: order?.paymentMethod,
            },
            {
              label: "Amount Received",
              value: `₹ ${order?.totalAmount}`,
            },

            { label: "Created At", value: order?.bookingDate },
            {
              label: "Razorpay Order Id",
              value: order?.razorpay_order_id || "N/A",
            },
            {
              label: "Razorpay Payment Id",
              value: order?.razorpay_payment_id || "N/A",
            },
            {
              label: "Order Id",
              value: order?._id || "No data found",
            },
            // { label: "Status", value: order?.status },
          ].map((item, index) => (
            <h2
              key={index}
              className="flex justify-between items-center gap-10 w-1/2 border-b border-neutral-300 m-1 truncate"
            >
              {item.label}:{" "}
              <span className="text-xl font-bold  w-full text-right">
                {item.value}
              </span>
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentTransactionCash);
