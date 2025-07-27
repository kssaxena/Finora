import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import { PencilLine, Trash2 } from "lucide-react";

const CategoriesVerified = ({ startLoading, stopLoading }) => {
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  const VerifiedCategories = categories.filter(
    (category) => category.status.toLowerCase() === "verified"
  );
  console.log(VerifiedCategories);
  // console.log("Categories:", categories);
  const user = useSelector((store) => store.UserInfo.user);
  const tableHeadersCategories = [
    "Category ID",
    "Category Name",
    "Status",
    "Creation date",
    "No. of Subcategory",
    "Delete",
  ];
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

  const [searchTermCategories, setSearchTermCategories] = useState("");
  const [filteredCategory, setFilteredCategory] = useState(VerifiedCategories);

  const handleSearchCategory = (e) => {
    const searchValueCategory = e.target.value;
    setSearchTermCategories(searchValueCategory);

    if (searchValueCategory === "") {
      setFilteredCategory(VerifiedCategories);
    } else {
      const filtered = VerifiedCategories.filter(
        (category) =>
          category._id.includes(searchValueCategory) ||
          category.title.toLowerCase().includes(searchValueCategory)
      );
      setFilteredCategory(filtered);
    }
  };

  useEffect(() => {
    setFilteredCategory(VerifiedCategories);
  }, []);

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

      // console.log("Response:", response);
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

  const handleDeleteCategory = async ({ categoryId }) => {
    try {
      startLoading();
      const response = await FetchData(
        `categories/category/delete/${categoryId}`,
        "delete"
      );
      console.log(response);
      alert("category has been deleted successfully");
      // window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  {
    console.log(filteredCategory);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermCategories}
          onChange={handleSearchCategory}
          Placeholder={"Search by ID or Name..."}
        />
        <Button
          label={"Add Category"}
          onClick={() =>
            setHandlePopup((prev) => {
              return { ...prev, addCategoryPopup: true };
            })
          }
        />
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersCategories.map((header, index) => (
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
            {filteredCategory.length > 0 ? (
              filteredCategory.map((category) => (
                <tr key={category.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-category/${category._id}`}
                    >
                      {category._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.status}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.createdAt}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.subcategories.length}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div>
                      {" "}
                      {/* <Button
                        label={<PencilLine />}
                        onClick={() =>
                          setHandlePopup((prev) => {
                            return { ...prev, addCategoryPopup: true };
                          })
                        }
                      /> */}
                      <Button
                        label={<Trash2 />}
                        onClick={() =>
                          handleDeleteCategory({ categoryId: category._id })
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersCategories.length}
                  className="text-center py-4"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {handlePopup.addCategoryPopup && (
          <div className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0 z-50">
            <div className="bg-white shadow-2xl rounded-xl w-fit h-fit px-10 py-10 flex justify-center items-center">
              <form
                ref={categoryFormRef}
                onSubmit={submitCategory}
                // onSubmit={(e) => {
                //   e.preventDefault();
                //   submitCategory;
                // }}
                className="flex flex-col gap-2 "
              >
                <h1>Add Main & Sub category</h1>
                <InputBox
                  LabelName={"Category"}
                  Placeholder={"Add Category"}
                  Name={"category"}
                  Required
                />
                <InputBox
                  LabelName={"Sub Category"}
                  Placeholder={"Add Sub Category"}
                  Name={"subcategory"}
                  Required
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    // onChange={(e) =>
                    //   setImage(e.target.files[0])
                    // }
                  />
                </div>
                <Button label={"Confirm"} type={"submit"} />
                <Button
                  label={"Cancel"}
                  onClick={() =>
                    setHandlePopup((prev) => {
                      return { ...prev, addCategoryPopup: false };
                    })
                  }
                  className={"hover:bg-red-500"}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoadingUI(CategoriesVerified);
