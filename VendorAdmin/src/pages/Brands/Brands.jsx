import React, { useEffect, useRef, useState } from "react";
import LoadingUI from "../../components/Loading";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectionBox";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Pencil, Trash } from "lucide-react";

const Brands = ({ startLoading, stopLoading }) => {
  const formRef = useRef(null);
  const user = useSelector((store) => store.UserInfo.user);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all brands and categories on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `brands/get-all-brands-for-vendor`,
          "get"
        );
        // console.log(response);
        setBrands(response.data.data);
      } catch (err) {
        // setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };

    const fetchCategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `category-subcategory/get-category-subcategory/${user?.[0]?._id}`,

          "get"
        );
        console.log(response);
        setCategories(response.data.data.categories);
      } catch (err) {
        // alert(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchBrands();
    fetchCategories();
  }, []);

  const addBrandRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      startLoading();
      const response = await FetchData(
        "brands/vendor/add-brand-request",
        "post",
        formData,
        true
      );
      console.log(response);
      alert(
        "Your Brand is sent for approval... It might take time to get reviewed"
      );
      formData.reset();
      setShowForm(false);
    } catch (error) {
      alert(parseErrorMessage(error.response.data));
      console.log("Error in adding request for a new brand!", error);
      setShowForm(false);
    } finally {
      stopLoading();
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    const filteredBrands = brands.filter(
      (brand) => !selectedBrands.includes(brand.id)
    );
    setBrands(filteredBrands);
    setSelectedBrands([]);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    const sortedBrands = [...brands].sort((a, b) =>
      e.target.value === "name"
        ? a.name.localeCompare(b.name)
        : b.products - a.products
    );
    setBrands(sortedBrands);
  };

  // Handle filtering
  const filteredBrands = brands.filter((brand) =>
    brand?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grayBG p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">Brands</h2>

      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row w-full justify-between items-center mb-4 gap-4 lg:gap-2">
        <InputBox
          LabelName={"Search Brands"}
          Type="text"
          Placeholder="Search by Brand..."
          Value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />

        <SelectBox
          LabelName="Sort by"
          Name="sortBy"
          Value={sortBy}
          Placeholder="Sort by"
          Options={[
            { value: "name", label: "Sort by Name" },
            { value: "products", label: "Sort by Products" },
          ]}
          onChange={handleSortChange}
          className="w-full"
        />
      </div>

      {/* Add Brand Button */}
      <div className="mb-4">
        <Button
          onClick={() => setShowForm(!showForm)}
          label={showForm ? "Cancel" : "Add Brand"}
        />
        {selectedBrands.length > 0 && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded ml-4 hover:bg-red-700"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Brand Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">Brand Name</th>
              <th className="py-3 px-4 border-b">Brand Logo</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr
                key={brand._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-semibold">{brand.title}</td>
                <td className="py-3 px-4 text-center w-10 h-10">
                  <img src={brand.logo.url} />
                </td>
                <td className="py-3 px-4 text-green-500 font-bold">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    <Trash />
                  </button>
                  {brand.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Brand Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-2xl"
          >
            <form
              ref={formRef}
              onSubmit={addBrandRequest}
              className="grayBG p-4 rounded mb-6 shadow"
            >
              <InputBox
                Type="text"
                LabelName={"Brand name"}
                Name={"brand"}
                Placeholder="Enter Brand Name"
              />
              <InputBox
                Type="file"
                Name={"image"}
                LabelName="Logo "
                Placeholder="Enter Logo"
              />
              <SelectBox
                LabelName="Main Category"
                Name="category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                Placeholder="Select main category"
                Options={categories?.map((cat) => ({
                  label: cat.title,
                  value: cat._id, // Correctly linking ID for selection
                }))}
              />

              {selectedCategory !== null && (
                <SelectBox
                  LabelName="subcategory"
                  Name="subcategoryId"
                  Placeholder="Select subcategory"
                  Options={categories
                    ?.find((cat) => cat._id === selectedCategory)
                    ?.subcategories.map((subcat) => ({
                      label: subcat.title,
                      value: subcat._id, // Correctly linking ID for selection
                    }))}
                />
              )}

              <div className="flex flex-col gap-3">
                <Button label={"Confirm"} type={"submit"} />
                <Button
                  className={"hover:bg-red-400"}
                  label={"Cancel"}
                  onClick={() => {
                    // Add Brand Logic
                    setShowForm(false);
                  }}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(Brands);
