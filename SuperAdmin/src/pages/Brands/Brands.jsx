import React, { useEffect, useRef, useState } from "react";
import LoadingUI from "../../components/Loading";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectionBox";
import Button from "../../components/Button";

const Brands = ({ startLoading, stopLoading }) => {
  const formRef = useRef(null);
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
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };

    const fetchCategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `categories/get-all-category-and-subcategories`,
          "get"
        );
        console.log(response);
        setCategories(response.data.data.categories);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch products.");
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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Brands</h2>

      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row w-full justify-evenly items-center mb-4 gap-4 lg:gap-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded lg:w-1/3 w-full"
        />
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="border px-3 py-2 rounded w-full lg:w-1/3 "
        >
          <option value="name">Sort by Name</option>
          <option value="products">Sort by Products</option>
        </select>
      </div>

      {/* Add Brand Button */}
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Brand request"}
        </button>
        {selectedBrands.length > 0 && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded ml-4 hover:bg-red-700"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Add/Edit Brand Form */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={addBrandRequest}
          className="bg-gray-100 p-4 rounded mb-6 shadow"
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
            Placeholder="Enter Logo URL"
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
            <Button label={"Add request"} type={"submit"} />
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
      )}

      {/* Brand Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              {/* <th className="py-3 px-4 border-b">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedBrands(
                      e.target.checked ? brands.map((brand) => brand.id) : []
                    )
                  }
                />
              </th> */}
              <th className="py-3 px-4 border-b">Brand Name</th>
              <th className="py-3 px-4 border-b">Brand Logo</th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr
                key={brand._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                {/* <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand._id)}
                    onChange={(e) =>
                      setSelectedBrands((prev) =>
                        e.target.checked
                          ? [...prev, brand._id]
                          : prev.filter((id) => id !== brand._id)
                      )
                    }
                  />
                </td> */}
                <td className="py-3 px-4 font-semibold">{brand.title}</td>
                <td className="py-3 px-4 text-center w-10 h-10">
                  <img src={brand.logo.url} />
                </td>
                <td className="py-3 px-4 text-green-500 font-bold">
                  {/* <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEditBrand(brand)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    Delete
                  </button> */}
                  {brand.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingUI(Brands);
