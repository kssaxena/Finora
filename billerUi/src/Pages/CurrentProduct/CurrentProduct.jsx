import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentProduct = ({ startLoading, stopLoading }) => {
  const { productId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentProduct, setCurrentProduct] = useState([]);
  const [currentBrand, setCurrentBrand] = useState([]);
  const [currentSubCategory, setCurrentSubCategory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [currentVendor, setCurrentVendor] = useState([]);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };
  useEffect(() => {
    const fetchProduct = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `products/admin/get-single-product/${productId}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setCurrentProduct(response.data.data);
            setCurrentBrand(response.data.data.brand);
            setCurrentSubCategory(response.data.data.subcategory);
            setCurrentVendor(response.data.data.vendor);
            setCurrentCategory(response.data.data.category);
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

    fetchProduct();
  }, [user]);

  const handleDeleteProduct = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/admin/single-product/${productId}`,
        "delete"
      );
      console.log(response);
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
        <h2>
          Vendor Id:{" "}
          <span className="text-xl font-bold">
            {currentProduct?.vendor?._id}
          </span>
        </h2>
        <h1>
          CurrentProduct Id:{" "}
          <span className="text-xl font-bold">{currentProduct?._id}</span>
        </h1>
        <div className="flex justify-evenly items-center gap-5 py-10">
          <Button
            label={"Delete Product"}
            onClick={handleDeleteProduct}
            className={"hover:bg-red-500"}
          />
          {/* <Button label={"Ban Product"} /> */}
          {/* <Button label={"Edit Product"} /> */}
        </div>
      </div>
      <div className="flex justify-evenly items-center px-4 py-10 bg-white shadow-m rounded-xl w-3/4 ">
        <div className="w-full flex justify-center flex-col items-center">
          <h1 className="text-center text-2xl mb-10 font-semibold">
            Product Description
          </h1>
          {[
            { label: "Name", value: currentProduct?.name },
            {
              label: " Product Image",
              value: (
                <div className="w-full flex justify-end items-center">
                  <img
                    src={currentProduct?.images?.[0]?.url}
                    alt="no image found"
                    className="w-20 h-20 "
                  />
                </div>
              ),
            },
            { label: "Brand", value: currentBrand?.title },
            {
              label: "Brand Logo",
              value: (
                <div className="w-full flex justify-end items-center">
                  <img src={currentBrand?.logo?.url} className="w-20 h-20 " />
                </div>
              ),
            },
            { label: "Description", value: currentProduct?.description },
            { label: "SubCategory", value: currentSubCategory?.title },
            {
              label: "SubCategory Image",
              value: (
                <div className="w-full flex justify-end items-center">
                  <img
                    src={currentSubCategory?.image?.url}
                    className="w-20 h-20 "
                  />
                </div>
              ),
            },
            { label: "SubCategory ID", value: currentSubCategory?._id },
            { label: "Category", value: currentCategory?.title },

            { label: "Category ID", value: currentCategory?._id },
            {
              label: "Price",
              value: `₹ ${currentProduct?.price?.sellingPrice}`,
            },
            { label: "Quantity", value: currentProduct?.stockQuantity },
            { label: "SKU", value: currentProduct?.sku },
            {
              label: "Specifications",
              value: currentProduct?.specifications?.details,
            },
            { label: "Product Created At", value: currentProduct?.createdAt },
            { label: "Vendor Name", value: currentVendor?.name },
            { label: "Vendor Email", value: currentVendor?.email },
            {
              label: "Vendor Contact Number",
              value: currentVendor?.contactNumber,
            },

            // { label: "Category", value: currentProduct?.category?._id },
            // { label: "Sub-Category", value: currentProduct?.subcategory?._id },
          ].map((item, index) => (
            <h2
              key={index}
              className="flex justify-between items-center gap-10 w-1/2 border-b border-neutral-300 m-1"
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

export default LoadingUI(CurrentProduct);
