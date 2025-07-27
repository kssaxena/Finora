import React, { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import SelectBox from "../../Components/SelectionBox";
import LoadingUI from "../../Components/Loading";
import { FetchData } from "../../Utility/FetchFromApi";
import TextArea from "../../Components/TextWrapper";

const Policies = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [policies, setPolicies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [brands, setBrands] = useState([]);
  const [policyFor, setPolicyFor] = useState("");
  const [modalOpen1, setModalOpen1] = useState(false);
  const formRef = useRef(null);
  const tableHeaders = [
    "Policy ID",
    "Policy name",
    "Effective from",
    "Last Effective",
  ];

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
          "get"
        );

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
        // console.log(response);
        if (response.data.success) setBrands(response.data.data);
      } catch {
        setError("Failed to fetch brands.");
      }
    };

    const GetAllPolicies = async () => {
      try {
        startLoading();
        const response = await FetchData(`policies/product-policy`, "get");
        console.log(response);
        if (response.data.success) setPolicies(response.data.data);
      } catch {
        setError("Failed to fetch policies.");
      }
    };

    getAllMainSubcategories();
    GetAllBrands();
    GetAllPolicies();
  }, []);

  const handleSubmit = async (e) => {
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
        `policies/product-policy`,
        "post",
        formData
        // true
      );
      console.log(response);
      setSuccess("Product policy added successfully!");
      alert("Product policy added successfully!");
      // window.location.reload();
      setModalOpen1(false);
    } catch (err) {
      console.log(err);
      alert("Failed to add the policy.");
      setError(err.response?.data?.message || "Failed to add the policy.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add policies</h2>
      <Button label={"Add new Policy"} onClick={() => setModalOpen1(true)} />

      <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
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
          {policies?.length > 0 ? (
            policies?.map((policy) => (
              <tr key={policy._id}>
                <td className="border border-gray-500 px-4 py-2">
                  <span className="hover:text-blue-500 underline-blue-500 hover:underline cursor-pointer">
                    {policy._id}
                  </span>
                </td>
                <td className="border border-gray-500 px-4 py-2">
                  {policy?.title}
                </td>
                <td className="border border-gray-500 px-4 py-2">
                  {policy.expiryDate}
                </td>
                <td className="border border-gray-500 px-4 py-2">
                  {policy.createdAt}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeaders.length} className="text-center py-4">
                No policies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen1 && (
        <div className="fixed top-0 left-0 w-full h-full z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              Create New Product Policy
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* ==================== POLICY METADATA ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  LabelName="Title*"
                  Placeholder="e.g., 30-Day Return Policy"
                  Name="title"
                  Required={true}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    Policy Type* <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="policyType"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="return">Return</option>
                    <option value="warranty">Warranty</option>
                    <option value="shipping">Shipping</option>
                    <option value="refund">Refund</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black mb-1">
                    Applies To <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="policyFor"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setPolicyFor(e.target.value);
                    }}
                  >
                    <option value="">Select an option </option>
                    <option value="all">All Products</option>
                    {/* <option value="product">Specific Products</option> */}
                    <option value="category">Category</option>
                    <option value="subcategory">Subcategory</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>
              </div>

              {/* ==================== POLICY CONTENT ==================== */}
              <div className="space-y-4">
                <InputBox
                  LabelName="Policy Text*"
                  Placeholder="Full policy details..."
                  Name="policy"
                  Type="textarea"
                  Required={true}
                />

                <TextArea
                  LabelName="Description"
                  Name="description"
                  Placeholder="Enter description"
                />

                <TextArea
                  LabelName="Short Summary"
                  Placeholder="Customer-facing summary..."
                  Name="shortSummary"
                  Type="textarea"
                />

                <TextArea
                  LabelName="Terms & Conditions"
                  Placeholder="Additional legal terms..."
                  Name="termsAndConditions"
                  Type="textarea"
                />
              </div>

              {/* ==================== SCOPE SELECTION ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policyFor != "all" && (
                  <div className="space-y-2">
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
                  </div>
                )}

                {policyFor === "subcategory" && (
                  <div className="space-y-2">
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
                )}

                {policyFor === "brand" && (
                  <div className="space-y-2">
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
                  </div>
                )}
              </div>

              {/* ==================== DATES & ACTIVATION ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputBox
                  LabelName="Effective Date*"
                  Name="effectiveDate"
                  Type="date"
                  Required={true}
                />

                <InputBox
                  LabelName="Expiry Date"
                  Name="expiryDate"
                  Type="date"
                />
              </div>

              {/* ==================== REGIONAL SETTINGS ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    Region* <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="region"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                  >
                    <option value="global">Global</option>
                    <option value="country">Country</option>
                    <option value="state">State</option>
                    <option value="city">City</option>
                  </select>
                </div>

                <InputBox
                  LabelName="Country"
                  Placeholder="Applicable country"
                  Name="country"
                />

                <InputBox
                  LabelName="State"
                  Placeholder="Applicable state"
                  Name="state"
                />

                <InputBox
                  LabelName="City"
                  Placeholder="Applicable city"
                  Name="city"
                />

                <InputBox
                  LabelName="Language*"
                  Placeholder="e.g., English"
                  Name="language"
                  Value="en"
                  Required={true}
                />
              </div>

              {/* ==================== BULK APPLY TOGGLE ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="appliesToAllCategories"
                    id="appliesToAllCategories"
                    className="h-4 w-4 text-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="appliesToAllCategories"
                    className="text-sm text-black"
                  >
                    Apply to All Categories
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="appliesToAllSubcategories"
                    id="appliesToAllSubcategories"
                    className="h-4 w-4 text-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="appliesToAllSubcategories"
                    className="text-sm text-black"
                  >
                    Apply to All Subcategories
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="appliesToAllBrands"
                    id="appliesToAllBrands"
                    className="h-4 w-4 text-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="appliesToAllBrands"
                    className="text-sm text-black"
                  >
                    Apply to All Brands
                  </label>
                </div>
              </div>

              <div className="flex gap-5 justify-center items-center">
                <Button label={"Create Policy"} type="submit" />
                <Button label={"Cancel"} onClick={() => setModalOpen1(false)} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Policies);
