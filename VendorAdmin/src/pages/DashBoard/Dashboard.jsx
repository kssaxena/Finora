import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import Orders from "../Orders/Orders";
import Categories from "../Category/Category";
import Brands from "../Brands/Brands";
import ManageStocks from "../Manage_Stocks/ManageStocks";
import Products from "../Products/Products";
import WalletTransactions from "../Wallet_Transactions/WalletTransaction";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../utils/Slice/UserInfoSlice";
import { FetchData } from "../../utils/FetchFromApi";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LoadingUI from "../../components/Loading";
import VerifiedDrivers from "../Delivery-partner/VerifiedDrivers";
import dayjs from "dayjs";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);
  const Dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [sortedOrders, setSortedOrders] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD
    const todaysOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.updatedAt).toISOString().split("T")[0];
      return orderDate === today;
    });
    setSortedOrders(todaysOrders);
  }, [allOrders]);

  // const handleDateChange = (e) => {
  //   setSelectedDate(e.target.value);
  // };

  // const handleSort = () => {
  //   if (!selectedDate) {
  //     setSortedOrders(allOrders);
  //     return;
  //   }
  //   const filtered = allOrders.filter((order) => {
  //     const orderDate = new Date(order.updatedAt).toISOString().split("T")[0];
  //     return orderDate === selectedDate;
  //   });
  //   setSortedOrders(filtered);
  // };

  // console.log(user?.[0]?._id);

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Orders per Month",
        data: [],
        backgroundColor: "#8E44AD",
      },
    ],
  });

  useEffect(() => {
    if (!allOrders || allOrders.length === 0) return;

    // Get months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize counts
    const orderCounts = Array(12).fill(0);

    allOrders.forEach((order) => {
      const date = dayjs(order.createdAt);
      if (date.isValid()) {
        const month = date.month(); // 0-indexed
        orderCounts[month]++;
      }
    });

    setBarData({
      labels: months,
      datasets: [
        {
          label: "Orders per Month",
          data: orderCounts,
          backgroundColor: "#8E44AD",
        },
      ],
    });
  }, [allOrders]);

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

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `vendors/vendor-profile/${user?.[0]?._id}`,
          "get"
        );
        // console.log(response);
        setVendor(response.data.data);
        // console.log(response);
      } catch (err) {
        setError("Failed to load vendor profile.");
      } finally {
        stopLoading();
      }
    };

    fetchVendor();
  }, [vendor]);

  const handleLogin = () => {
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/vendor-profile");
  };
  const [products, setProducts] = useState([]);

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#8E44AD",
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#FF5733",
          "#28B463",
          "#C70039",
          "#1ABC9C",
          "#FFC300",
        ],
      },
    ],
  });
  // console.log(pieData);

  const fetchProducts = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      // console.log(response);

      const fetchedProducts = response.data.data || [];
      setProducts(fetchedProducts);
      // console.log(fetchedProducts);

      // Aggregate stockQuantity by category
      const categoryData = {};
      fetchedProducts.forEach((product) => {
        const { category, stockQuantity } = product;
        if (category) {
          categoryData[category?.title] =
            (categoryData[category?.title] || 0) + stockQuantity;
        }
      });
      // console.log(categoryData);

      // Prepare pieData
      const labels = Object.keys(categoryData);
      const data = Object.values(categoryData);

      setPieData((prevPieData) => ({
        ...prevPieData,
        labels,
        datasets: [
          {
            ...prevPieData.datasets[0],
            data,
          },
        ],
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (user?.[0]?._id) fetchProducts();
  }, [user]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Orders":
        return <Orders />;
      case "Categories":
        return <Categories />;
      case "Brands":
        return <Brands />;
      case "Manage Stock":
        return <ManageStocks />;
      case "Products":
        return <Products />;
      case "Delivery-partner":
        return <VerifiedDrivers />;
      case "Wallet Transactions":
        return <WalletTransactions />;
      case "Home":
      default:
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-evenly lg:w-full lg:items-center shadow-lg p-4 bg-white rounded-lg ">
              <div className="p-4 bg-[#B5BD63]  shadow-xl rounded">
                <h3 className="text-black">Total Orders</h3>
                <p className="text-2xl font-bold">{allOrders?.length}</p>
              </div>
              <div className="p-4 bg-[#19465C] shadow-xl text-white rounded">
                <h3 className="">Products</h3>
                <p className="text-2xl font-bold">{products?.length}</p>
              </div>
              <div className="p-4 bg-[#8EBD9D] shadow-xl rounded">
                <h3 className="text-gray-500">Rating</h3>
                <p className="text-2xl font-bold">
                  Avg:{user?.[0]?.ratings?.average}/Total:
                  {user?.[0]?.ratings?.reviewsCount}
                </p>
              </div>
              <div className="p-4 text-white bg-[#8E44AD] shadow-xl rounded">
                <h3 className="">Transactions (₹)</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>

            <div className="flex lg:flex-row flex-col lg:gap-0 gap-5">
              <div className="bg-white p-6 rounded-lg shadow-lg lg:w-full lg:h-[70vh] h-fit overflow-scroll">
                <h2 className="text-2xl font-bold text-gray-700">
                  Todays Orders
                </h2>
                {/* Detailed Order List */}
                <div className="container p-4">
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
                              <td className="py-2 px-4 border-b">
                                {order._id}
                              </td>
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
                                  {order.products[0]?.product.subcategory ||
                                    "N/A"}
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
                              <td className="py-2 px-4 border-b">
                                {order.orderStatus}
                              </td>
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

              <div className="flex justify-center flex-col items-center gap-4 lg:w-3/4 w-full">
                <div className="bg-white shadow rounded p-4 lg:w-3/4 w-full">
                  <h3 className="text-gray-500">Monthly Orders</h3>
                  <Bar data={barData} />
                </div>
                <div className="bg-white shadow rounded p-4 lg:w-3/4 w-full">
                  <h3 className="text-gray-500">
                    Category Wise Product's Count
                  </h3>
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const Hamburger = () => {
    const [hamburger, showHamburger] = useState(false);
    const menuVariants = {
      hidden: { x: "-100%", opacity: 0 },
      visible: {
        x: "0%",
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
      exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
      },
    };
    return (
      <div className="  w-full lg:hidden bg-purple-600 flex justify-start py-5 z-50">
        <div className="flex justify-start items-center w-full gap-10">
          <button
            className={`ml-5 border rounded-lg p-1 text-white`}
            onClick={() => showHamburger(true)}
          >
            <Menu />
          </button>
          <h1>
            Hello, <span className="text-white">{user?.[0]?.name}</span>
          </h1>
        </div>

        {hamburger && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="dashboard w-full h-screen bg-gray-800 text-white flex flex-col absolute top-0 z-50"
          >
            <div className="p-4 text-2xl font-bold bg-purple-600 flex justify-between items-center">
              <h1>Dashboard</h1>
              <button onClick={() => showHamburger(false)} className="">
                <X />
              </button>
            </div>
            <ul className="flex-1">
              {[
                "Home",
                "Orders",
                "Categories",
                "Brands",
                "Manage Stock",
                "Products",
                "Delivery-partner",
                "Wallet Transactions",
              ].map((menu) => (
                <li
                  key={menu}
                  className={`p-4 hover:bg-gray-700 cursor-pointer ${
                    selectedMenu === menu ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setSelectedMenu(menu)}
                >
                  {menu}
                </li>
              ))}
            </ul>
            <div className="mb-10 w-full flex flex-col gap-5 justify-center items-center p-5">
              {user?.length > 0 ? (
                <div className="flex flex-col justify-center items-center gap-5 w-full">
                  <Button
                    label={"View Profile"}
                    className={"w-full"}
                    onClick={handleProfile}
                  />
                  <Button
                    label={"Logout"}
                    className={"w-full"}
                    onClick={() => {
                      Dispatch(clearUser());
                      localStorage.removeItem("AccessToken");
                      localStorage.removeItem("RefreshToken");
                      alert("You are logged out! Please log in.");
                      setTimeout(() => navigate("/login"), 100);
                      console.log(localStorage.getItem("RefreshToken"));
                    }}
                  />
                </div>
              ) : (
                <Button
                  label={"Login"}
                  className={"w-full"}
                  onClick={handleLogin}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="flex lg:flex-row flex-col h-screen bg-gray-100">
      <div className="dashboard w-64 bg-gray-800 text-white lg:flex flex-col hidden ">
        <div className="p-4 text-2xl font-bold bg-purple-600">Dashboard</div>
        <ul className="flex-1">
          {[
            "Home",
            "Orders",
            "Categories",
            "Brands",
            "Manage Stock",
            "Products",
            "Delivery-partner",
            "Wallet Transactions",
          ].map((menu) => (
            <li
              key={menu}
              className={`p-4 hover:bg-gray-700 cursor-pointer ${
                selectedMenu === menu ? "bg-gray-700" : ""
              }`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
        <div className="mb-10 w-full flex flex-col gap-5 justify-center items-center p-5">
          {user?.length > 0 ? (
            <div className="flex flex-col justify-center items-center gap-5 w-full">
              <Button
                label={"View Profile"}
                className={"w-full"}
                onClick={handleProfile}
              />
              <Button
                label={"Logout"}
                className={"w-full"}
                onClick={() => {
                  Dispatch(clearUser());
                  alert("you are logged Out! Please log in");
                  navigate("/login");
                }}
              />
            </div>
          ) : (
            <Button
              label={"Login"}
              className={"w-full"}
              onClick={handleLogin}
            />
          )}
        </div>
      </div>
      <div>
        <Hamburger />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default LoadingUI(Dashboard);
