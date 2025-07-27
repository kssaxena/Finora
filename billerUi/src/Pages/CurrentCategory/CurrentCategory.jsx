import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { Trash } from "lucide-react";

const CurrentCategory = ({ startLoading, stopLoading }) => {
  const { categoryId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [CurrentCategory, setCurrentCategory] = useState();
  const [CurrentSubCategory, setCurrentSubCategory] = useState([]);
  console.log(CurrentSubCategory);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `categories/get-category-by-id/${categoryId}`,
            "get"
          );
          if (response.data.success) {
            setCurrentCategory(response.data.data.category);
            setCurrentSubCategory(response.data.data.category.subcategories);
          } else {
            setError("Failed to load Categories.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch Categories."
          );
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllOrders();
  }, [user]);

  const handleDeleteSubcategory = async ({ subcategoryId }) => {
    // console.log(subcategoryId);
    try {
      startLoading();
      const response = await FetchData(
        `categories/sub-category/delete/${subcategoryId}`,
        "delete"
      );
      //   console.log(response);
      alert("Subcategory has been deleted successfully");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete Subcategory.");
    } finally {
      stopLoading();
    }
  };

  const details = [
    { label: "Name", value: CurrentCategory?.title },
    { label: "Created At", value: CurrentCategory?.createdAt },
    { label: "Updated At", value: CurrentCategory?.updatedAt },
    { label: "Status", value: CurrentCategory?.status },
    { label: "Number of Subcategories", value: CurrentSubCategory?.length },
  ];
  return (
    <div className="">
      <div className="flex justify-center items-center gap-10 pb-5">
        {/* <Button label={"Ban User"} onClick={HandleUserBan} /> */}
        {/* <Button label={"Edit User"} /> */}
        <div>
          <h1>
            Category Id: <span className="text-xl font-bold">{categoryId}</span>
          </h1>
        </div>
      </div>
      {/* <h1>current User</h1> */}
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Categories Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Contents
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Information
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-gray-700 font-medium">
                    {item.label}
                  </td>
                  <td className="border px-4 py-2 text-gray-800">
                    {item.value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 ">
        <h1>
          All the Subcategories under{" "}
          <span className="font-semibold ">
            {CurrentCategory?.title} Category
          </span>
          {""} are listed below
        </h1>
        {CurrentSubCategory?.map((subcategory) => (
          <div
            key={subcategory.id}
            className="bg-white shadow m-5 rounded-xl p-4 flex justify-between items-center "
          >
            <div>
              <h2>
                <span className="font-semibold ">Subcategory Id: </span>
                {subcategory._id}
              </h2>
              <h2>
                <span className="font-semibold ">Name: </span>
                {subcategory.title}
              </h2>
              <h2>
                <span className="font-semibold ">Created at: </span>
                {subcategory.createdAt}
              </h2>
              <h2>
                <span className="font-semibold ">Last Updated at: </span>
                {subcategory.updatedAt}
              </h2>
            </div>
            <img src={subcategory.image.url} className="w-20 rounded-full " />
            <div>
              <Button
                label={<Trash />}
                onClick={() =>
                  handleDeleteSubcategory({ subcategoryId: subcategory._id })
                }
              />
              {/* <Button label={"Edit Subcategory"} /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(CurrentCategory);
