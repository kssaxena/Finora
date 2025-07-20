import React, { useState } from "react";
import Login from "../Login/Login";
import VendorRegistrationForm from "../Registration/Registration";
import background from "../../assets/HomeBackground.jpg";
import Button from "../../components/Button";

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="">
      <div className="absolute h-screen w-screen object-fill overflow-hidden hidden lg:block">
        <img src={background} />
      </div>
      <div className="lg:flex justify-center items-center text-black lg:text-4xl text-base font-bold font-sans lg:absolute relative backdrop-blur lg:h-20 w-full">
        <h1 className="w-full text-center">
          Welcome to Rider's Kart Vendor Hub
        </h1>
      </div>

      <section className="flex lg:flex-row flex-col ">
        {/* Login Component */}
        <div className="login lg:w-1/2 lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
          <Login openRegister={() => setShowPopup(true)} />
        </div>
        {/* register Component */}
        <div className="register lg:w-1/2 w-full lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
          <div className="flex flex-col justify-center items-start gap-10 lg:px-5 lg:py-10 lg:mr-5 p-2 shadow-xl rounded-xl text-black backdrop-blur-sm">
            <h1 className="lg:text-2xl text-base font-bold lg:my-8">
              New to Rider's Kart Ecom service<br></br>Register your self with
              simple steps and <br></br>Sell and grow your business online
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
                <li className="text-base text-gray-800">
                  Create your account and set up your online store.
                </li>
                <li className="text-base text-gray-800">
                  Upload your products with detailed descriptions and images.
                </li>
                <li className="text-base text-gray-800">
                  Set up payment methods and configure shipping options.
                </li>
                <li className="text-base text-gray-800">
                  Launch your store and start promoting through social media and
                  marketing campaigns.
                </li>
                <li className="text-base text-gray-800">
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
          {/* <VendorRegistrationForm /> */}
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 flex lg:justify-center lg:items-center h-screen w-screen bg-opacity-90 bg-neutral-500 overflow-scroll">
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
