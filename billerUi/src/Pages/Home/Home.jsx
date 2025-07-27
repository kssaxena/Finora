import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  ListOrdered,
  Newspaper,
  Package,
  PencilLine,
  ScanLine,
  User,
  X,
  Bike,
  IndianRupee,
  MemoryStick,
  ChartColumnStacked,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import { ClipboardCopy } from "lucide-react";
import LoadingUI from "../../Components/Loading";
import Users from "../Users/Users";
import VendorUnderReview from "../Vendor_UnderReview/VendorUnderReview";
import VendorsVerified from "../Vendors_Verified/VendorsVerified";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Brandsverified from "../Brands_Verified/Brandsverified";
import BrandsUnderReview from "../Brands_UnderReview/BrandsUnderReview";
import Promotion from "../Promotions/promotion";
import TransactionOnline from "../TransactionOnline/TransactionOnline";
import TransactionCash from "../TransactionCash/TransactionCash";
import VendorsOrders from "../VendorsOrders/VendorsOrders";
import DriverVerified from "../Driver_Verified/DriverVerified";
import DriverUnderReview from "../Driver_UnderReview/DriverUnderReview";
import CategoriesVerified from "../CategoriesVerified/CategoriesVerified";
import CategoriesUnderReview from "../CategoriesUnderReview/CategoriesUnderReview";
import Policies from "../Policy/Policies";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Users");
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isDriverOpen, setIsDriverOpen] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const tableHeadersBrands = [
    "Brand ID",
    "Brand name",
    "Added by",
    "Added On",
    "Status",
  ];

  //filtering functions for each entities

  return (
    <div className="flex min-h-screen overflow-scroll">
      {user === null || user.length === 0 ? (
        <div>
          <h1>
            You are not logged in kindly request your Team leader to provide you
            an Admin id and password.
          </h1>
        </div>
      ) : (
        <div>
          {" "}
          <motion.aside
            className="w-64 text-black p-4 shadow-lg fixed overscroll-auto top-0 h-screen bg-black/50 overflow-scroll no-scrollbar z-10"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
          >
            <nav>
              <ul>
                <li
                  className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                    activeSection === "Users"
                      ? "bg-[#DF3F33] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveSection("Users")}
                >
                  {<User />}Users
                </li>

                {/* Vendors with nested items */}
                <li className="mb-2">
                  <div
                    className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                    onClick={() => setIsVendorOpen(!isVendorOpen)}
                  >
                    {<ListOrdered />}Vendors
                  </div>
                  {isVendorOpen && (
                    <ul className="ml-6 mt-2">
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Vendors (Under review)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Vendors (Under review)")
                        }
                      >
                        Under review
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer transition-all mb-2 ${
                          activeSection === "Vendors (Verified)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveSection("Vendors (Verified)")}
                      >
                        Verified
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          activeSection === "Vendors Orders"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveSection("Vendors Orders")}
                      >
                        Vendors Orders
                      </li>
                    </ul>
                  )}
                </li>

                {/* Brands with nested items */}
                <li className="mb-2">
                  <div
                    className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                  >
                    {<MemoryStick />}Brands
                  </div>
                  {isBrandOpen && (
                    <ul className="ml-6 mt-2">
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Brands (Under review)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Brands (Under review)")
                        }
                      >
                        Under review
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          activeSection === "Brands (Verified)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveSection("Brands (Verified)")}
                      >
                        Verified
                      </li>
                    </ul>
                  )}
                </li>
                <li className="mb-2">
                  <div
                    className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    {<ChartColumnStacked />}Category & Subcategory
                  </div>
                  {isCategoryOpen && (
                    <ul className="ml-6 mt-2">
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Categories (Under review)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Categories (Under review)")
                        }
                      >
                        Under review
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          activeSection === "Categories (Verified)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Categories (Verified)")
                        }
                      >
                        Verified
                      </li>
                    </ul>
                  )}
                </li>

                {/* Other items */}
                <li
                  className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                    activeSection === "Products"
                      ? "bg-[#DF3F33] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveSection("Products")}
                >
                  {<Package />}Products
                </li>
                <li
                  className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                    activeSection === "Orders"
                      ? "bg-[#DF3F33] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveSection("Orders")}
                >
                  {<ScanLine />}Orders
                </li>
                <li className="mb-2">
                  <div
                    className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                    onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                  >
                    {<IndianRupee />}Transactions
                  </div>
                  {isTransactionOpen && (
                    <ul className="ml-6 mt-2">
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Transactions (Online payment)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Transactions (Online payment)")
                        }
                      >
                        Transactions <br />
                        (Online payment)
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Transactions (Cash on delivery)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Transactions (Cash on delivery)")
                        }
                      >
                        Transactions <br />
                        (Cash on delivery)
                      </li>
                    </ul>
                  )}
                </li>
                <li className="mb-2">
                  <div
                    className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                    onClick={() => setIsDriverOpen(!isDriverOpen)}
                  >
                    {<Bike />}Driver
                  </div>
                  {isDriverOpen && (
                    <ul className="ml-6 mt-2">
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Drivers (Under review)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() =>
                          setActiveSection("Drivers (Under review)")
                        }
                      >
                        Drivers <br />
                        (Under review)
                      </li>
                      <li
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                          activeSection === "Drivers (Verified)"
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveSection("Drivers (Verified)")}
                      >
                        Drivers <br />
                        (Verified)
                      </li>
                    </ul>
                  )}
                </li>
                <li
                  className={`p-4 rounded-md cursor-pointer transition-all duration-300 mb-2 ${
                    activeSection === "Promotions"
                      ? "bg-[#DF3F33] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveSection("Promotions")}
                >
                  {<Heart />}Promotions
                </li>
                <li
                  className={`p-4 rounded-md cursor-pointer transition-all duration-300 ${
                    activeSection === "Policies"
                      ? "bg-[#DF3F33] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveSection("Policies")}
                >
                  {<Vote />}Policies
                </li>
              </ul>
            </nav>
          </motion.aside>
          <main className="flex-1 p-6 ml-64 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ duration: 0.5 }}
            >
              {activeSection === "Users" && <Users />}
              {activeSection === "Vendors (Under review)" && (
                <VendorUnderReview />
              )}
              {activeSection === "Vendors (Verified)" && <VendorsVerified />}
              {activeSection === "Vendors Orders" && <VendorsOrders />}
              {activeSection === "Products" && <Products />}
              {activeSection === "Brands (Verified)" && <Brandsverified />}
              {activeSection === "Brands (Under review)" && (
                <BrandsUnderReview />
              )}
              {activeSection === "Categories (Verified)" && (
                <CategoriesVerified />
              )}
              {activeSection === "Categories (Under review)" && (
                <CategoriesUnderReview />
              )}
              {activeSection === "Orders" && <Orders />}
              {activeSection === "Transactions (Online payment)" && (
                <TransactionOnline />
              )}
              {activeSection === "Transactions (Cash on delivery)" && (
                <TransactionCash />
              )}
              {activeSection === "Drivers (Under review)" && (
                <DriverUnderReview />
              )}
              {activeSection === "Drivers (Verified)" && <DriverVerified />}
              {activeSection === "Promotions" && <Promotion />}
              {activeSection === "Policies" && <Policies />}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Dashboard);
