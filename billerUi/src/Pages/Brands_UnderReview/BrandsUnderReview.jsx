import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
const BrandsUnderReview = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const formRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [allBrands, setAllBrands] = useState([]);
  // const [IdToVerify, setIdToVerify] = useState("");
  const tableHeadersBrands = [
    "Brand ID",
    "Brand name",
    "Logo",
    "Added On",
    "Action",
  ];
  const [searchTermBrands, setSearchTermBrands] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(allBrands);

  const handleSearchBrands = (e) => {
    const searchValueBrands = e.target.value;
    setSearchTermBrands(searchValueBrands);

    if (searchValueBrands === "") {
      setFilteredBrands(allBrands);
    } else {
      const filtered = allBrands.filter(
        (brand) =>
          brand._id.includes(searchValueBrands) ||
          brand.title.includes(searchValueBrands)
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
            "brands/admin/get-all-non-verified-brands",
            "get"
          );
          console.log(response);
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

  const AcceptBrand = async (id) => {
    try {
      startLoading();
      const response = await FetchData(
        `brands/admin/verify-brand-request/${id}`,
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
  const DeleteBrand = async (id) => {
    try {
      startLoading();
      const response = await FetchData(
        `brands/admin/delete-brand/${id}`,
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
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermBrands}
          onChange={handleSearchBrands}
          Placeholder={"Search by Brand ID or Brand name"}
        />
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
                <tr key={brand.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      // to={`/current-brand/${brand._id}`}
                    >
                      {brand._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <img src={brand.logo.url} className="w-12"/>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {brand.createdAt}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 ">
                    {/* {brand.status} */}
                    <Button
                      label={"Accept"}
                      onClick={() => {
                        AcceptBrand(brand._id);
                      }}
                    />
                    <Button
                      label={"Reject"}
                      className={"hover:bg-red-400 ml-5"}
                      onClick={() => DeleteBrand(brand._id)}
                    />
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

export default LoadingUI(BrandsUnderReview);
