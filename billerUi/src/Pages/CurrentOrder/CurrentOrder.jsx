import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentOrder = ({ startLoading, stopLoading }) => {
  const { orderId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentOrder, setCurrentOrder] = useState([]);
  const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [CurrentOrderAddress, setCurrentOrderAddress] = useState([]);

  // console.log(orderId);
  // console.log(user);
  console.log(currentOrder);
  console.log(currentOrderProducts);
  console.log(CurrentOrderAddress);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/admin/current-order/${orderId}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setCurrentOrder(response.data.data.order);
            setCurrentOrderProducts(response.data.data.order.products);
            setCurrentOrderAddress(response.data.data.order.shippingAddress);
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

    fetchOrder();
  }, [user]);

  // console.log(currentOrder);
  //   console.log(currentOrderProducts);
  //   console.log(CurrentOrderAddress);

  const fullAddress = `${CurrentOrderAddress?.street}, ${CurrentOrderAddress?.city}, ${CurrentOrderAddress?.state} ${CurrentOrderAddress?.postalCode}, ${CurrentOrderAddress?.country}`;
  console.log(currentOrderProducts);
  return (
    <div>
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Details
        </h2>
        <h1>
          Order Id:{" "}
          <span className="text-2xl font-semibold">{currentOrder?._id}</span>
        </h1>
        <div className="flex justify-center items-center gap-20 mt-10">
          {/* <Button label={"Return Order"} />
          <Button label={"Replace Order"} />
          <Button label={"Make Order Pending"} />
          <Button label={"Cancel Order"} /> */}
        </div>
        <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Details
          </h2>
          <div className="space-y-4">
            {[
              { label: "User", value: currentOrder?.user },
              { label: "Product ID", value: currentOrderProducts?.[0]?._id },
              { label: "Address", value: fullAddress },
              { label: "Booking Date", value: currentOrder?.bookingDate },
              { label: "Order Status", value: currentOrder?.orderStatus },
              { label: "Payment Status", value: currentOrder?.paymentStatus },
              {
                label: "Price",
                value: `₹ ${currentOrder?.totalAmount}`,
              },
              { label: "Vendor", value: currentOrder?.vendor },
            ].map((item, index) => (
              <div key={index} className="flex">
                <span className="font-medium text-gray-600 w-1/3">
                  {item.label}
                </span>
                <span className="text-xl font-medium text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentOrder);
