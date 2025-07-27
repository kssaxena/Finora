import React, { useEffect, useState } from "react";
import Login from "../Login/Login";
import VendorRegistrationForm from "../Registration/Registration";
import Button from "../../components/Button";
import { Bar, Line, PolarArea, Radar } from "react-chartjs-2";

const Hero = () => {
  // this is for bar chart data

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
    // if (!allOrders || allOrders.length === 0) return;

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
    const orderCounts = Array(12)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100));
    setBarData({
      labels: months,
      datasets: [
        {
          label: "Orders per Month",
          data: orderCounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
        },
      ],
    });
  }, []);

  //this is for line chart data

  const labels = [
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
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // this is for polar chart data
  const dataPolar = {
    labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
    datasets: [
      {
        label: "My First Dataset",
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
        ],
      },
    ],
  };

  // this is for radar chart data
  const dataRadar = {
    labels: [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "My Second Dataset",
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="">
      <div className="absolute h-screen w-screen object-fill overflow-hidden hidden lg:block blur-sm ">
        <div className="flex justify-centre items-centre">
          <div className="w-1/2">
            <PolarArea data={dataPolar} />
          </div>
          <div className="w-full h-1/2">
            <Bar data={barData} />
          </div>
        </div>
        <div className="flex justify-centre items-centre">
          <div className="w-1/2">
            <Line data={data} />
          </div>
          <div className="w-1/2">
            <Radar data={dataRadar} />
          </div>
        </div>
        {/* <Bar data={barData} /> */}
      </div>
      <div className="lg:flex justify-center items-center lg:text-4xl text-base lg:absolute relative backdrop-blur lg:h-20 w-full">
        <h1 className="w-full text-center text-black">
          Welcome to Finora Billing Hub
        </h1>
      </div>

      <section className="flex lg:flex-row flex-col ">
        {/* Login Component */}
        <div className="login lg:w-1/2 lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative  bg-black/20">
          <Login openRegister={() => setShowPopup(true)} />
        </div>
        {/* register Component */}
        <div className="register lg:w-1/2 w-full lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative bg-black/20">
          <div className="flex flex-col justify-center items-start gap-10 lg:px-5 lg:py-10 lg:mr-5 p-2 rounded-xl backdrop-blur-sm grayBG shadow-2xl shadow-neutral-400">
            <h1 className="lg:text-2xl text-base lg:my-8">
              New to Finora Billing service<br></br>Register your self with
              simple steps and <br></br>Grow your business online
            </h1>
            <Button
              label={"Register Here"}
              onClick={() => {
                setShowPopup(true);
              }}
              className={"lg:hidden block"}
            />

            <div className="max-w-3xl mx-auto px-6">
              <ol className="list-decimal pl-5 space-y-4">
                <li className="text-base">
                  Create your account and set up your online store.
                </li>
                <li className="text-base">
                  Upload your products with detailed descriptions and images.
                </li>
                <li className="text-base">
                  Set up payment methods and configure shipping options.
                </li>
                <li className="text-base">
                  Launch your store and start promoting through social media and
                  marketing campaigns.
                </li>
                <li className="text-base">
                  Track your sales, orders, and customer feedback to grow your
                  business.
                </li>
              </ol>
            </div>
            <Button
              label={"Register Here"}
              onClick={() => {
                setShowPopup(true);
              }}
              className={"hidden lg:block"}
            />
          </div>
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 flex lg:justify-center lg:items-center h-screen w-screen bg-opacity-90 bg-white overflow-scroll">
            <div className="flex flex-col lg:justify-center lg:items-center lg:gap-10 lg:w-3/4">
              <Button
                label={"Close"}
                className={"hover:bg-red-500 hidden lg:block"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />
              <Button
                label={"Cancel "}
                className={"hover:bg-red-500 lg:hidden block"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />
              <VendorRegistrationForm
                onClose={() => {
                  setShowPopup(false);
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Hero;
