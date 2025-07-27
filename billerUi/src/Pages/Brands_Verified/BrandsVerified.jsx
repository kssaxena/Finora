import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import SelectBox from "../../Components/SelectionBox";

const BrandsVerified = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const formRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allBrands, setAllBrands] = useState([]);
  const tableHeadersBrands = [
    "Brand ID",
    "Brand Logo",
    "Brand name",
    "Added by",
    "Added On",
    "Status",
  ];
  const [searchTermBrands, setSearchTermBrands] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(allBrands);
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  // console.log(allBrands);
  const handleSearchBrands = (e) => {
    const searchValueBrands = e.target.value.toLowerCase();
    setSearchTermBrands(searchValueBrands);

    if (searchValueBrands === "") {
      setFilteredBrands(allBrands);
    } else {
      const filtered = allBrands.filter(
        (order) =>
          order._id.toLowerCase().includes(searchValueBrands) ||
          order.title.toLowerCase().includes(searchValueBrands)
      );
      setFilteredBrands(filtered);
    }
  };

  useEffect(() => {
    setFilteredBrands(allBrands);
  }, [allBrands]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "brands/admin/get-all-verified-brands",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllBrands(response.data.data);
          } else {
            setError("Failed to load brands.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch brands.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchBrands();
  }, [user]);

  const addBrand = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    // console.log(formData);
    try {
      startLoading();
      const response = await FetchData(
        "brands/admin/add-new-brand",
        "post",
        formData,
        true
      );
      // console.log(response);
      alert("Brand added successfully");
      // window.location.reload();
    } catch (err) {
      alert("Failed to add brand.");
      setError(err.response?.data?.message || "Failed to add brand.");
    } finally {
      stopLoading();
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermBrands}
          onChange={handleSearchBrands}
          Placeholder={"Search by Brand ID or Brand name"}
        />
        <div>
          <Button
            label={"Add new Brand"}
            onClick={() => {
              setShowPopup(true);
            }}
          />
        </div>
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersBrands.map((header, index) => (
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
            {filteredBrands?.length > 0 ? (
              filteredBrands?.map((brand) => (
                <tr key={brand._id}>
                  <td className="border border-gray-500 px-4 py-2">
                    {/* <Link to={`/current-brand/${brand._id}`}>{brand._id}</Link> */}
                    <span className="hover:text-blue-500 underline-blue-500 hover:underline cursor-pointer">
                      {brand._id}
                    </span>
                  </td>
                  <td className="border border-gray-500 px-4 py-2 h-10 w-10">
                    <img src={brand.logo.url} />
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand.adminName}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand.createdAt}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersBrands.length}
                  className="text-center py-4"
                >
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="absolute top-0 left-0 backdrop-blur-xl w-screen h-screen flex justify-center items-center z-50">
          <div className="top-16 left-16 w-4/5 max-w-md bg-white shadow-md rounded-md p-4">
            <h2 className="text-xl font-bold mb-4">Add new Brand</h2>
            <form ref={formRef} onSubmit={addBrand}>
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
                <Button label={"Add brand"} type={"submit"} />
                <Button
                  className={"hover:bg-red-400"}
                  label={"Cancel"}
                  onClick={() => {
                    // Add Brand Logic
                    setShowPopup(false);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoadingUI(BrandsVerified);
