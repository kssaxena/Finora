import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import { Check, Trash } from "lucide-react";

const CategoriesUnderReview = ({ startLoading, stopLoading }) => {
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  const UnVerifiedCategories = categories.filter(
    (category) => category.status.toLowerCase() === "under-review"
  );
  const tableHeadersCategories = [
    "Category ID",
    "Category Name",
    "Subcategory Name",
    "Status",
    "Action",
  ];

  const [searchTermCategories, setSearchTermCategories] = useState("");
  const [filteredCategory, setFilteredCategory] =
    useState(UnVerifiedCategories);

  const handleSearchCategory = (e) => {
    const searchValueCategory = e.target.value;
    setSearchTermCategories(searchValueCategory);

    if (searchValueCategory === "") {
      setFilteredCategory(UnVerifiedCategories);
    } else {
      const filtered = UnVerifiedCategories.filter(
        (category) =>
          category._id.includes(searchValueCategory) ||
          category.title.toLowerCase().includes(searchValueCategory)
      );
      setFilteredCategory(filtered);
    }
  };

  useEffect(() => {
    setFilteredCategory(UnVerifiedCategories);
  }, [UnVerifiedCategories]);

  const AcceptCategory = async (id) => {
    try {
      startLoading();
      const response = await FetchData(
        `categories/category/accept/${id}`,
        "post"
      );
      console.log(response);
      alert(response.data.message);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add brand.");
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  const RejectCategory = async (id) => {
    try {
      startLoading();
      const response = await FetchData(
        `categories/category/delete/${id}`,
        "delete"
      );
      console.log(response);
      alert(response.data.message);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to delete brand.");
    } finally {
      stopLoading();
    }
  };

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
                      // to={`/current-order/${category._id}`}
                    >
                      {category._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.status}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        label={<Check />}
                        onClick={() => {
                          AcceptCategory(category._id);
                        }}
                      />
                      <Button
                        label={<Trash />}
                        onClick={() => {
                          RejectCategory(category._id);
                        }}
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
      </div>
    </section>
  );
};

export default LoadingUI(CategoriesUnderReview);
