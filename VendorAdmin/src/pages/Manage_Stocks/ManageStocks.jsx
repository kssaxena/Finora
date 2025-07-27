import React, { useEffect, useRef, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import LoadingUI from "../../components/Loading";
import Button from "../../components/Button";
import { Plus, Minus } from "lucide-react";
import InputBox from "../../components/InputBox";

const ManageStocks = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [handlePopup, setHandlePopup] = useState({
    addStocksPopup: false,
    removeStocksPopup: false,
  });
  const [productId, setProductId] = useState("");
  const formRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        // console.log(response);
        if (response.data.success) setProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchProducts();
  }, []);
  // console.log(products);
  const handleAddStock = async () => {
    const formData = new FormData(formRef.current);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      startLoading();
      const response = await FetchData(
        `products/add-stock-quantity/${productId}`,
        "post",
        formData
      );
      console.log(response);
      alert("stock added successfully");
    } catch (err) {
      alert("stock not added");
      setError(err.response?.data?.message || "Failed to add stock.");
    } finally {
      stopLoading();
    }
  };
  const handleRemoveStock = async () => {
    const formData = new FormData(formRef.current);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      startLoading();
      const response = await FetchData(
        `products/remove-stock-quantity/${productId}`,
        "post",
        formData
      );
      console.log(response);
      alert("stock added successfully");
    } catch (err) {
      alert("stock not added");
      setError(err.response?.data?.message || "Failed to remove stock.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Manage Stocks</h2>
      <p>Monitor and manage stock levels here.</p>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Product name to modify stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md"
        />
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">Product ID</th>
              <th className="py-3 px-4 border-b">Category Name</th>
              <th className="py-3 px-4 border-b">Subcategory Name</th>
              <th className="py-3 px-4 border-b">Product Name</th>
              <th className="py-3 px-4 border-b">Stock Quantity</th>
              <th className="py-3 px-4 border-b text-center">Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((elements) => (
              <tr
                key={elements._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">{elements?._id}</td>
                <td className="py-3 px-4 font-semibold">
                  {elements?.category?.title}
                </td>
                <td className="py-3 px-4 font-semibold">
                  {elements?.subcategory?.title}
                </td>
                <td className="py-3 px-4 font-semibold">{elements?.name}</td>
                <td className="py-3 px-4 text-center">
                  {elements?.stockQuantity}
                </td>
                <td
                  className={`py-3 px-4 font-bold flex justify-center items-center`}
                >
                  <div className="flex gap-5">
                    <button
                      className="text-green-500 flex justify-center items-center text-xs"
                      // onClick={() => {
                      //   setProductId(elements._id);
                      //   // handleAddStock();
                      // }}
                      onClick={() => {
                        setProductId(elements._id);
                        setHandlePopup((prev) => {
                          return { ...prev, addStocksPopup: true };
                        });
                      }}
                    >
                      <Plus />
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setProductId(elements._id);
                        setHandlePopup((prev) => {
                          return { ...prev, removeStocksPopup: true };
                        });
                      }}
                      className="text-red-500 flex justify-center items-center text-xs"
                    >
                      <Minus />
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {handlePopup.addStocksPopup && (
        <div className="absolute top-0 left-0 backdrop-blur-2xl h-screen w-screen flex justify-center items-center">
          <form
            ref={formRef}
            onSubmit={handleAddStock}
            className="w-96 h-fit bg-white px-5 py-5 shadow-2xl rounded-xl "
          >
            <h1>Adding stock on product id: {productId}</h1>
            <InputBox
              LabelName={"Enter no. Stock/s to add"}
              Placeholder={"Not less than 1"}
              Name={"quantityToAdd"}
              // Value={"addStock"}
              Type="number"
              Required
            />
            <div className="flex flex-col gap-2">
              <Button
                label={"Add Stock"}
                type={"submit"}
                // className={"hover:bg-green-500"}
              />
              <Button
                label={"Cancel"}
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, addStocksPopup: false };
                  })
                }
                className={"hover:bg-red-500"}
              />
            </div>
          </form>
        </div>
      )}
      {handlePopup.removeStocksPopup && (
        <div className="absolute top-0 left-0 backdrop-blur-2xl h-screen w-screen flex justify-center items-center">
          <form
            ref={formRef}
            onSubmit={handleRemoveStock}
            className="w-96 h-fit bg-white px-5 py-5 shadow-2xl rounded-xl "
          >
            <h1>Removing stock on product id: {productId}</h1>
            <InputBox
              LabelName={"Enter no. Stock/s to remove"}
              Placeholder={"Not less than 1"}
              Name={"quantityToRemove"}
              // Value={"RemoveStock"}
              Type="number"
              Required
            />
            <div className="flex flex-col gap-2">
              <Button
                label={"Remove Stock"}
                type={"submit"}
                // className={"hover:bg-green-500"}
              />
              <Button
                label={"Cancel"}
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, removeStocksPopup: false };
                  })
                }
                className={"hover:bg-red-500"}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(ManageStocks);
