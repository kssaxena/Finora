import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";
import LoadingUI from "../../components/Loading";
import TextArea from "../../components/TextWrapper";
import { CircleFadingPlus } from "lucide-react";
import PopUp from "../../components/PopUpWrapper";
// import { categories } from "../../constants/AllProducts.Vendor";

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [images, setImages] = useState(null);
  const formRef = useRef(null);
  const mrpRef = useRef(null);
  const discountRef = useRef(null);
  const spRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState({
    image: false,
  });
  const [UrlData, setUrlData] = useSearchParams();

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, WebP, SVG).");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 1MB.");
      e.target.value = "";
      return;
    }
    setImages(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleImageCancel = () => {
    setImages(null);
    setImagePreview(null);
    document.getElementById("imageInput").value = "";
  };
  const findProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  // Function to calculate and update Selling Price
  const updateSellingPrice = () => {
    const mrp = parseFloat(mrpRef.current?.value) || 0;
    const discount = parseFloat(discountRef.current?.value) || 0;

    if (mrp > 0 && discount >= 0 && discount <= 100) {
      const sellingPrice = mrp - (mrp * discount) / 100;
      spRef.current.value = sellingPrice.toFixed(2); // Update the Selling Price field
    } else {
      spRef.current.value = ""; // Clear if invalid input
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        console.log(response);
        if (response.data.success) setProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);
    // console.log(images);
    // formData.append("image", images);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      startLoading();
      const response = await FetchData(
        `products/register-product/${user?.[0]?._id}`,
        "post",
        formData,
        true
      );
      console.log(response);
      setSuccess("Product added successfully!");
      setProducts((prev) => [...prev, response.data.data.product]);
      alert("Product added successfully!");
      // window.location.reload();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add the product.");
    } finally {
      stopLoading();
    }
  };

  const handleDeleteProduct = async (_id) => {
    setError("");
    setSuccess("");

    try {
      startLoading();
      const response = await FetchData(
        `products/delete-products/${_id}`,
        "delete"
      );
      if (response.data.success) {
        setSuccess("Product deleted successfully!");
        setProducts((prev) => prev.filter((product) => product._id !== _id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the product.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
          "get"
        );
        // console.log(response);

        // Ensure categories exist before setting state
        const categories = response.data?.data?.categories || [];
        setCategories(categories);

        // Extract all subcategories from each category
        const allSubcategories = categories.flatMap(
          (category) => category.subcategories || []
        );
        setSubcategories(allSubcategories);
      } catch (error) {
        console.log("Error getting all main subcategories", error);
      } finally {
        stopLoading();
      }
    };

    const GetAllBrands = async () => {
      try {
        startLoading();
        const response = await FetchData("brands/get-all-brands", "get");
        console.log(response);
        if (response.data.success) setBrands(response.data.data);
      } catch {
        setError("Failed to fetch brands.");
      }
    };

    getAllMainSubcategories();
    GetAllBrands();
  }, []);

  const ImageUpdationForm = ({ onClose, imagesRequired }) => {
    const [images, setImages] = useState([]);

    const formRef = useRef(null);
    const productId = UrlData.get("productId");

    const handleAddImages = async (event) => {
      event.preventDefault();

      const formData = new FormData(formRef.current);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      try {
        startLoading();
        const response = await FetchData(
          `products/add-images/${productId}`,
          "patch",
          formData,
          true
        );

        console.log("Image uploaded", response.data);
        alert(response.data.message);
        onClose();
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        stopLoading();
      }
    };

    return (
      <PopUp onClose={onClose}>
        <div className="flex justify-center items-center w-[80vw] place-self-center  ">
          <form
            ref={formRef}
            onSubmit={handleAddImages}
            className="w-full h-[90vh] p-16 flex flex-col items-center justify-center rounded-2xl  bg-white   "
          >
            <label
              className="block mb-2 font-medium text-black text-2xl"
              for="file_input"
            >
              Upload Images
            </label>
            <div className="w-full h-fit grid grid-cols-2 grid-rows-5 gap-5 justify-center items-center my-10  ">
              {Array(imagesRequired())
                .fill("")
                .map((_, index) => {
                  return (
                    <div
                      className={`flex items-center justify-center space-x-6 ${
                        index + 1 == imagesRequired() && (index + 1) % 2 !== 0
                          ? "col-span-2 "
                          : ""
                      }`}
                      key={index}
                    >
                      <div className="shrink-0 flex justify-center items-center h-16 w-16 ">
                        {images[index] && (
                          <img
                            id="preview_img"
                            className=" object-cover rounded  "
                            src={images[index]?.src}
                            alt="uploaded image"
                          />
                        )}
                      </div>
                      <label className={`block  `}>
                        <span className="sr-only">Choose photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          name="images"
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold   file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 border border-neutral-200 p-2 rounded-full"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImages((prevImages) => [
                                ...prevImages,
                                {
                                  id: Math.random(),
                                  src: reader.result,
                                },
                              ]);
                            };
                            reader.readAsDataURL(file);
                            // console.log(images);
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
            </div>
            <Button label="Submit" Type="submit" className="mt-10" />
          </form>
        </div>
      </PopUp>
    );
  };

  return (
    <div className="lg:max-w-6xl lg:mx-auto lg:p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-6 mx-4">
        Your Products
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <Button
        label="Add New Product"
        Type="button"
        className="mb-6 mx-4"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-start lg:items-center justify-center  backdrop-blur-xl p-4 h-screen w-screen overflow-auto top-0 left-0">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-fit h-fit lg:px-20 lg:py-10 py-4">
            <h2 className="text-lg font-semibold text-gray-800 lg:mb-4 w-full text-center">
              Add New Product
            </h2>
            <form
              ref={formRef}
              onSubmit={handleAddProduct}
              className="flex flex-col overscroll-scroll w-full justify-evenly items-center"
            >
              <div className="flex lg:flex-row flex-col justify-start items-start lg:gap-10">
                {" "}
                <div className="flex flex-col justify-start items-center lg:w-fit w-full px-2">
                  <InputBox
                    LabelName="Product Name"
                    Name="name"
                    Placeholder="Enter product name"
                  />

                  <SelectBox
                    className2="w-full"
                    LabelName="Brand"
                    Name="brand"
                    Placeholder="Select main category"
                    Options={brands?.map((brand) => ({
                      label: brand.title,
                      value: brand._id, // Correctly linking ID for selection
                    }))}
                  />

                  <SelectBox
                    className2="w-full"
                    LabelName="Main Category"
                    Name="category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    Placeholder="Select main category"
                    Options={categories?.map((cat) => ({
                      label: cat.title,
                      value: cat._id, // Correctly linking ID for selection
                    }))}
                  />

                  {subcategories.length > 0 && (
                    <SelectBox
                      className2="w-full"
                      LabelName="Subcategory"
                      Name="subcategory"
                      Placeholder="Select subcategory"
                      Options={subcategories
                        .filter(
                          (subs) => subs.category._id === selectedCategory
                        )
                        .map((sub) => ({
                          label: sub.title,
                          value: sub._id, // Ensure unique key
                        }))}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start items-center w-full lg:w-fit px-2">
                  <InputBox
                    LabelName="MRP"
                    Type="number"
                    Name="MRP"
                    Placeholder="Enter price"
                    Ref={mrpRef}
                    OnInput={updateSellingPrice}
                  />
                  <InputBox
                    LabelName="Discount(%)"
                    Type="number"
                    Name="discount"
                    Placeholder="Enter Discount percentage"
                    Ref={discountRef}
                    OnInput={updateSellingPrice}
                  />
                  <InputBox
                    LabelName="Selling Price (Optional)"
                    Type="number"
                    Name="SP"
                    Value={""}
                    Placeholder="0"
                    Disabled={true}
                    Ref={spRef}
                  />
                  <InputBox
                    LabelName="Stock Quantity"
                    Type="number"
                    Name="stockQuantity"
                    Placeholder="Enter stock quantity"
                  />
                  <InputBox
                    LabelName="Stock keeping unit (SKU)"
                    Name="sku"
                    Placeholder="Enter SKU"
                  />
                </div>
                <div className="px-2">
                  <InputBox
                    LabelName="Upload Image"
                    Type="file"
                    Name={`image`}
                    Placeholder="Enter image URL"
                    onChange={(e) => {
                      handleImageFileChange(e);
                    }}
                  />
                  {imagePreview && (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md border"
                      />

                      {/* Cancel Button */}
                      <button
                        onClick={handleImageCancel}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <TextArea
                    LabelName="Description"
                    Name="description"
                    Placeholder="Enter product description"
                  />
                  <TextArea
                    LabelName="Specification"
                    Name="specifications"
                    Placeholder="Enter Specification"
                  />
                  <TextArea
                    LabelName="Tags"
                    Name="tags"
                    Placeholder="Enter Tags"
                  />
                  {/* <Button
                  label="Add Image"
                  Type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, { url: "", altText: "" }],
                    }))
                  }
                  className="mt-2"
                /> */}
                </div>
              </div>
              <div className="button flex lg:flex-row flex-col w-full lg:w-fit px-2 justify-end gap-2">
                <Button
                  label="Cancel"
                  Type="button"
                  className="bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button label="Add Product" Type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4 mx-4">
        Product List{" "}
        <span className="text-xs font-light">({products.length})</span>
      </h2>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product?._id}
                className="mx-2 p-4 border rounded-lg shadow-md bg-gray-100"
              >
                <h3 className="font-bold text-gray-900 flex items-center justify-start gap-10 ">
                  {product?.name}{" "}
                  <span className=" p-1 rounded-xl flex items-center  ">
                    <img
                      src={product?.images[0]?.url}
                      className="w-20 h-20 m-1 rounded-xl  shadow"
                    />
                  </span>
                  <button
                    onClick={() => {
                      setUrlData({ productId: product?._id });
                      setPopup((prev) => {
                        return { ...prev, image: true };
                      });
                    }}
                    title="Add images"
                  >
                    <CircleFadingPlus />
                  </button>
                </h3>
                <p className="truncate">{product?.description}</p>
                <p>
                  <strong>Category:</strong> {product?.category?.title} -{" "}
                  {product?.subcategory?.title}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {product?.price?.sellingPrice}
                </p>
                <p>
                  <strong>Stock:</strong> {product?.stockQuantity}
                </p>
                <Button
                  label="Delete"
                  Type="button"
                  className="mt-2 w-full hover:bg-red-500"
                  onClick={() => handleDeleteProduct(product?._id)}
                />
              </div>
            ))}
          </div>
          {popup.image && (
            <ImageUpdationForm
              onClose={() =>
                setPopup((prev) => {
                  return { ...prev, image: false };
                })
              }
              imagesRequired={() => {
                const product = findProductById(UrlData.get("productId"));
                return 10 - product?.images?.length;
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Products);
