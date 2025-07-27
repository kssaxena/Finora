import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import { ChevronDown, PencilLine, X, ClipboardCopy } from "lucide-react";

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allProducts, setAllProducts] = useState([]);
  // const [AllCategories, setAllCategories] = useState([]);
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [handlePopup, setHandlePopup] = useState({
    addCategoryPopup: false,
    allCategoryPopup: false,
    allSubCategoryPopup: false,
    addSubCategory: false,
    editSubcategory: false,
    selectedSubcategoryId: null,
    selectedSubcategoryTitle: null,
  });
  const categoryFormRef = useRef(null);
  const subcategoryFormRef = useRef(null);
  const editSubcategoryFormRef = useRef(null);

  const tableHeadersProducts = [
    "Product ID",
    "Vendor",
    "Product Name",
    "Category ID",
    "Subcategory ID",
  ];

  const [searchTermProduct, setSearchTermProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const handleSearchProduct = (e) => {
    const searchValueProduct = e.target.value;
    setSearchTermProduct(searchValueProduct);

    if (searchValueProduct === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts?.filter(
        (product) =>
          product._id.includes(searchValueProduct) ||
          product.vendor.includes(searchValueProduct) ||
          product.name.toLowerCase().includes(searchValueProduct)
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "products/admin/get-all-products-admin",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllProducts(response.data.data);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          console.log(err);
          setError(err.response?.data?.message || "Failed to Products");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllProducts();
  }, [user]);

  const submitCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(categoryFormRef.current);
    // formData.append("image", image);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      startLoading();
      const response = await FetchData(
        "categories/category/add",
        "post",
        formData,
        true
      );
      console.log(response);
      // setAddShowCategoryPopup(false);
      setHandlePopup((prev) => ({
        ...prev,
        addCategoryPopup: false,
      }));
      alert("Your category has been added successfully");
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const submitSubCategory = async (e, categoryId) => {
    e.preventDefault();
    const formData = new FormData(subcategoryFormRef.current);
    // formData.append("image");
    // formData.append("category", categoryId); // Attach category ID

    // Debugging: Log form data before sending it
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      startLoading();
      const response = await FetchData(
        "categories/sub-category/add",
        "post",
        formData,
        true
      );
      console.log("Subcategory Added:", response);
      alert("Subcategory Added Successfully!");
      // window.location.reload();

      // setHandlePopup((prev) => ({
      //   ...prev,
      //   addSubCategory: false, // Close popup after submission
      // }));
    } catch (error) {
      console.error("Error adding subcategory:", error);
    } finally {
      stopLoading();
    }
  };

  const handleEditSubcategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      startLoading();
      if (!handlePopup.selectedSubcategoryId) {
        alert("Subcategory ID is missing!");
        return;
      }

      const formData = new FormData(editSubcategoryFormRef.current);
      // formData.append("image", image);

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await FetchData(
        `categories/edit-sub-category/${handlePopup.selectedSubcategoryId}`,
        "post",
        formData,
        true
      );

      console.log("Response:", response);
      alert("Subcategory Edited Successfully!");
      window.location.reload(); // Refresh page to reflect changes

      // Close popup and reset state
      setHandlePopup({
        editSubcategory: false,
        selectedSubcategoryId: null,
      });
    } catch (error) {
      console.error("Error editing subcategory:", error);
      alert("Failed to edit subcategory.");
    } finally {
      stopLoading();
    }
  };

  // console.log("allProducts", allProducts);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <InputBox
        Type="test"
        Value={searchTermProduct}
        onChange={handleSearchProduct}
        Placeholder={"Search by Product Name, Product ID, Vendor ID"}
      />
      <div className=" h-[70vh] overflow-x-scroll overflow-y-scroll">
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl h-[100vh]">
          <thead>
            <tr>
              {tableHeadersProducts.map((header, index) => (
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
            {/* {console.log(filteredProducts)} */}
            {filteredProducts?.length > 0 ? (
              filteredProducts?.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-product/${product._id}`}
                    >
                      {product._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex flex-col justify-center items-center">
                      <h2 className=""> {product.vendor?.name}</h2>
                      <span className="text-gray-500 text-xs">
                        {product.vendor?._id}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-500 px-4 py-2 w-96 overflow-hidden  ">
                    <div className="flex justify-between">
                      <div>
                        <h2>{product.name}</h2>
                        <div className="flex gap-5">
                          <img
                            src={product.brand?.logo.url}
                            alt=""
                            className=" w-10"
                          />
                          <span className="text-gray-500 text-xs">
                            {product.brand?.title}
                          </span>
                        </div>
                      </div>
                      <span className="">
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-20 w-20"
                        />
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex flex-col justify-center items-center">
                      <h2 className=""> {product.category?.title}</h2>
                      <span className="text-gray-500 text-xs">
                        {product.category?._id}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex flex-col justify-center items-center">
                      <h2 className=""> {product.subcategory?.title}</h2>
                      <span className="text-gray-500 text-xs">
                        {product.subcategory?._id}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersProducts.length}
                  className="text-center py-4"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(Products);
