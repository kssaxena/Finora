import React, { useState, useEffect } from "react";
import { FetchData } from "../utils/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.UserInfo.user);
  const [VendorProduct, setVendorProducts] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      if (user.length > 0) {
        try {
          const response = await FetchData(
            `vendor/vendor-profile/${user?.[0]?._id}`,
            "get"
          );
          setVendor(response.data.data);
        } catch (err) {
          setError("Failed to load vendor profile.");
        }
      }
    };

    fetchVendor();
  }, [user]);

  const fetchProducts = async () => {
    if (user.length > 0) {
      try {
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        if (response.data.success) setVendorProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6 rounded-lg shadow-md max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex gap-4 justify-evenly items-center border-b-2 pb-5 lg:hidden">
        <Button label="Home" onClick={handleHome} />
        {/* <Button label="Edit Profile" /> */}
      </div>
      <motion.div
        className="flex items-center justify-between border-b pb-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/path-to-user-profile-image.jpg" // Replace with the actual path to the user's image
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.[0]?.name}</h1>
            <p className="text-gray-500">{user?.[0]?.email}</p>
            <p className="text-gray-500">
              <strong>Contact:</strong> {user?.[0]?.contactNumber}
            </p>
          </div>
        </div>
        <div className="lg:flex gap-4 hidden ">
          <Button label="Home" onClick={handleHome} />
          {/* <Button label="Edit Profile" onClick={handleHome} /> */}
        </div>
      </motion.div>

      {/* Location Section */}
      <motion.div
        className="border-b pb-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p>{user?.[0]?.location.address}</p>
        <p>
          {user?.[0]?.location.city}, {user?.[0]?.location.state},{" "}
          {user?.[0]?.location.country} - {user?.[0]?.location.postalCode}
        </p>
      </motion.div>

      {/* Business Details and Bank Details */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Business Details</h2>
          <p>
            <strong>Business Name:</strong>{" "}
            {user?.[0]?.businessDetails?.businessName}
          </p>
          <p>
            <strong>GST Number:</strong> {user?.[0]?.businessDetails?.gstNumber}
          </p>
          <p>
            <strong>Registered On:</strong>{" "}
            {new Date(
              user?.[0]?.businessDetails?.registrationDate
            ).toLocaleDateString()}
          </p>
        </div>
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bank Details</h2>
          <p>
            <strong>Account Holder:</strong>{" "}
            {user?.[0]?.bankDetails?.accountHolderName}
          </p>
          <p>
            <strong>Account Number:</strong>{" "}
            {user?.[0]?.bankDetails?.accountNumber}
          </p>
          <p>
            <strong>Bank Name:</strong> {user?.[0]?.bankDetails?.bankName}
          </p>
          <p>
            <strong>IFSC Code:</strong> {user?.[0]?.bankDetails?.ifscCode}
          </p>
        </div>
      </motion.div>

      {/* Ratings Section */}
      <motion.div
        className="border p-4 rounded-lg shadow mb-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold mb-2">Ratings</h2>
        <p>
          <strong>Average Rating:</strong> {user?.[0]?.ratings?.average}/5
        </p>
        <p>
          <strong>Total Reviews:</strong> {user?.[0]?.ratings?.reviewsCount}
        </p>
      </motion.div>

      {/* Products Section */}
      <motion.div
        className="border p-4 rounded-lg shadow mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-lg font-semibold mb-2">
          Total Registered Products: {VendorProduct?.length}
        </h2>
        {VendorProduct?.length > 0 ? (
          <ul className="list-disc list-inside">
            {VendorProduct.map((product) => (
              <li key={product?._id}>{product?.name}</li>
            ))}
          </ul>
        ) : (
          <p>No products listed.</p>
        )}
      </motion.div>

      {/* Account Status */}
      <motion.div
        className="border p-4 rounded-lg shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <h2 className="text-lg font-semibold mb-2">Account Status</h2>
        <p>{user?.[0]?.status}</p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user?.[0]?.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(user?.[0]?.updatedAt).toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
};

export default VendorProfile;
