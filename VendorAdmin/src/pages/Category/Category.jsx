import React, { useEffect, useRef, useState } from "react";
import { categoryData as initialData } from "../../constants/VendorDashboard.Categories";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import LoadingUI from "../../components/Loading";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { AnimatePresence } from "motion/react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";

const Categories = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    description: "",
    parent: "",
    products: 0,
    status: "Active",
    image: null,
  });
  const categoryFormRef = useRef(null);
  const SubcategoryFormRef = useRef(null);
  const [handlePopup, setHandlePopup] = useState({
    addCategoryPopup: false,
    editCategoryPopup: false,
    allSubCategoryPopup: false,
    addSubCategory: false,
    selectedSubcategoryId: null,
    selectedSubcategoryTitle: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  // console.log(categories);

  useEffect(() => {
    // only for categories
    const getAllCategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `category-subcategory/get-category-subcategory/${user?.[0]?._id}`,
          "get"
        );

        // Ensure categories exist before setting state
        setCategories(response.data?.data?.categories || []);
      } catch (error) {
        console.log("Error getting all main subcategories", error);
      } finally {
        stopLoading();
      }
    };

    getAllCategories();
  }, [user]);

  //  for all the subcategories under the category
  const getSubcategoryById = async ({ categoryId }) => {
    try {
      startLoading();
      const response = await FetchData(
        `category-subcategory/get-subcategory/${categoryId}`,
        "get"
      );
      console.log(response);

      // Ensure categories exist before setting state
      setSubcategories(response.data?.data?.subcategories || []);
    } catch (error) {
      console.log("Error getting all main subcategories", error);
    } finally {
      stopLoading();
    }
  };
  // Handle category form submission
  const submitCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(categoryFormRef.current);

    // for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
    // }
    try {
      startLoading();
      const response = await FetchData(
        `category-subcategory/category/add/new/${user?.[0]?._id}`,
        "post",
        formData,
        true
      );
      // console.log(response);
      setHandlePopup((prev) => ({
        ...prev,
        addCategoryPopup: false,
      }));
      alert("Your category has been added successfully");
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response?.data));
    } finally {
      stopLoading();
    }
  };
  // Handle subcategory form submission
  const submitSubcategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(SubcategoryFormRef.current);

    // for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
    // }
    try {
      startLoading();
      const response = await FetchData(
        `category-subcategory/new-subcategory/${user?.[0]?._id}`,
        "post",
        formData,
        true
      );
      // console.log(response);
      setHandlePopup((prev) => ({
        ...prev,
        addSubCategory: false,
      }));
      alert("Your category request has been added successfully");
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response?.data));
    } finally {
      stopLoading();
    }
  };
  // Handle edit category
  const handleEditCategory = ({ categoryId }) => {
    getSubcategoryById({ categoryId });
    setHandlePopup((prev) => {
      return { ...prev, editCategoryPopup: true };
    });
  };
  // Handle subcategory deletion
  const handleDeleteSubCategory = async ({ subcategoryId }) => {
    try {
      startLoading();
      const response = await FetchData(
        `category-subcategory/delete-subcategory/${subcategoryId}/${user?.[0]?._id}`,
        "delete"
      );
      console.log(response);
      setHandlePopup((prev) => {
        return { ...prev, editCategoryPopup: false };
      });
      alert("Your Subcategory has been deleted successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response?.data));
    } finally {
      stopLoading();
    }
  };

  // Handle bulk selection
  const toggleCategorySelection = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="grayBG p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">
        Active Category{" "}
        <span className="font-thin text-sm">
          (Total : <span className="font-bold">{categories?.length}</span>)
        </span>
      </h2>

      <div className="py-2">
        <Button
          className="z-0"
          label={"Add new Category"}
          onClick={() =>
            setHandlePopup((prev) => {
              return { ...prev, addCategoryPopup: true };
            })
          }
        />
      </div>

      {/* selling Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">Category ID</th>
              <th className="py-3 px-4 border-b">Category Name</th>
              <th className="py-3 px-4 border-b">Total Subcategory</th>
              <th className="py-3 px-4 border-b">
                Active from{" "}
                <span className="text-xs font-extralight">(MM/DD/YY)</span>
              </th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((elements) => (
              <tr
                key={elements._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      handleEditCategory({ categoryId: elements._id })
                    }
                    className="hover:text-blue-500 hover:underline"
                  >
                    {elements?._id}
                  </button>
                </td>
                <td className="py-3 px-4 font-semibold">{elements?.title}</td>
                <td className="py-3 px-4 font-semibold">
                  {elements?.subcategory?.length}
                </td>
                {/* <td className="py-3 px-4 ">{elements?.createdAt}</td> */}
                <td className="py-3 px-4 ">
                  {new Date(elements?.createdAt).toLocaleDateString()}
                </td>
                <td
                  className={`py-3 px-4 font-bold ${
                    elements.status === "Active"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {elements.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {handlePopup.addCategoryPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0"
          >
            <div className="grayBG shadow-2xl rounded-xl w-fit h-fit px-10 py-10 flex justify-center items-center">
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
                  <label className="block text-sm font-medium">
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
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {handlePopup.editCategoryPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0"
          >
            <div className="grayBG shadow-2xl rounded-xl w-3/4 h-fit px-10 py-10 flex flex-col gap-5 justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <Button
                  label={"Add more Subcategory"}
                  onClick={() =>
                    setHandlePopup((prev) => {
                      return { ...prev, addSubCategory: true };
                    })
                  }
                />
                <Button
                  label={"Close"}
                  onClick={() =>
                    setHandlePopup((prev) => {
                      return { ...prev, editCategoryPopup: false };
                    })
                  }
                />
              </div>
              {/* <h1>{subcategories[0]?.category}</h1> */}
              {subcategories.map((subcategory) => (
                <div className="border rounded-xl p-4 flex justify-between items-center w-full ">
                  <div>
                    <h1>Subcategory Id: {subcategory?._id}</h1>
                    <h1>Name: {subcategory?.title}</h1>
                    <h1>
                      Active from:{" "}
                      {new Date(subcategory?.createdAt).toLocaleDateString()}
                    </h1>
                  </div>

                  <img
                    src={subcategory?.image?.url}
                    className="rounded-full w-20 "
                  />
                  <Button
                    label={<Trash />}
                    onClick={() => {
                      handleDeleteSubCategory({
                        subcategoryId: subcategory?._id,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {handlePopup.addSubCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0"
          >
            <div className="grayBG shadow-2xl rounded-xl w-fit h-fit px-10 py-10 flex justify-center items-center">
              <form
                ref={SubcategoryFormRef}
                onSubmit={submitSubcategory}
                className="flex flex-col gap-2 "
              >
                <h1>Add new Subcategory</h1>
                <InputBox
                  LabelName={"Subcategory"}
                  Placeholder={"New Subcategory"}
                  Name={"title"}
                  Required
                />
                <InputBox
                  LabelName={"Subcategory"}
                  Value={subcategories[0]?.category}
                  Name={"categoryId"}
                  Required
                />
                {/* <InputBox
                  LabelName={"Sub Category"}
                  Placeholder={"Add Sub Category"}
                  Name={"subcategory"}
                  Required
                /> */}
                <div className="mt-4">
                  <label className="block text-sm font-medium">
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
                      return { ...prev, addSubCategory: false };
                    })
                  }
                  className={"hover:bg-red-500"}
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(Categories);
