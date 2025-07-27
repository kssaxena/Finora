import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button";
import { FetchData } from "../../Utility/FetchFromApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { alertError, alertSuccess } from "../../Utility/";
// import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import InputBox from "../../Components/InputBox";
import SelectBox from "../../Components/SelectionBox";
import { useSelector } from "react-redux";
import LoadingUI from "../../Components/Loading";

const RegisterDriver = ({ startLoading, stopLoading }) => {
  // variables----------------------------------------------------------------
  const FormRef = useRef();
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const user = useSelector((store) => store.UserInfo.user);
  const [allVendors, setAllVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  console.log(selectedVendor);
  const [imagePreviews, setImagePreviews] = useState({
    licenseImage: null,
    aadharImage: null,
    panImage: null,
    racFrontImage: null,
    racBackImage: null,
    insuranceImage: null,
    pollutionImage: null,
  });

  const [images, setImages] = useState({
    licenseImage: null,
    aadharImage: null,
    panImage: null,
    racFrontImage: null,
    racBackImage: null,
    insuranceImage: null,
    pollutionImage: null,
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, WebP, SVG).");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 1MB.");
      e.target.value = "";
      return;
    }

    setImages((prev) => ({ ...prev, [name]: file }));
    setImagePreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }));
  };

  const handleImageCancel = (name) => {
    setImages((prev) => ({ ...prev, [name]: null }));
    setImagePreviews((prev) => ({ ...prev, [name]: null }));
    document.getElementsByName(name)[0].value = "";
  };

  useEffect(() => {
    const fetchAllVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "vendor/admin/get-all-verified-vendor",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllVendors(response.data.data.vendor);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllVerifiedVendors();
  }, [user]);

  // Handel submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(FormRef.current);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Validate phone number (must be 10 digits)
    const phone = formData.get("phone");
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    // Validate Aadhar number (12 digits)
    const aadharNumber = formData.get("aadharNumber");
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      alert("Please enter a valid aadhar number");
      return;
    }

    // Validate PAN number (10 characters, alphanumeric, specific format)
    const panNumber = formData.get("panNumber");
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      alert("Please enter a valid Pan number");
      return;
    }

    // Validate Driving License number (adjust based on local rules, typically alphanumeric)
    const licenseNumber = formData.get("licenseNumber");
    const dlRegex = /^[A-Z]{2}\d{13}$/; // Adjust this regex as per the regional format
    if (!dlRegex.test(licenseNumber)) {
      alert("Please enter a valid Driving License number");
      return;
    }

    const plateNumber = formData.get("plateNumber");
    const plateRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (!plateRegex.test(plateNumber)) {
      alert("Please enter a valid Plate number");
      return;
    }

    try {
      startLoading();
      const response = await FetchData(
        `driver/register/${selectedVendor}`,
        "post",
        formData,
        true
        // vendorId === vendorId
      );

      console.log(response);

      alert(
        "Driver registered successfully, approve the partner from Under Review Section"
      );

      // Reset form fields and clear image previews
      FormRef.current.reset();

      // Navigate to home page and show success message
      navigate("/home");
    } catch (error) {
      console.log(error);
      // alertError(parseErrorMessage(error.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="w-full  rounded-lg  shadow-white-300 p-8  flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6 text-white">Personal Details</h1>
      <form
        onSubmit={handleSubmit}
        ref={FormRef}
        className="space-y-6 bg-white flex justify-center items-center flex-col  w-3/4 p-5 rounded-xl"
      >
        <div className="grid grid-cols-3 grid-rows-5 gap-4">
          <div>
            <InputBox
              LabelName="Name"
              Name="name"
              Placeholder="Enter your name"
            />
          </div>
          <div>
            <InputBox
              LabelName="Phone number"
              Name="phone"
              Type="number"
              Placeholder="Enter your contact number"
            />
          </div>
          <div>
            <InputBox
              LabelName="Address"
              Name="address"
              Placeholder="Enter your address"
            />
          </div>
          <div className="row-start-2">
            <InputBox
              LabelName="Driving License Number"
              Name="licenseNumber"
              Placeholder="Your Driving License Number"
            />
          </div>
          <div className="row-start-2">
            <InputBox
              LabelName="Aadhar Card Number"
              Name="aadharNumber"
              Type="number"
              Placeholder="Your Aadhar Card Number"
            />
          </div>
          <div className="row-start-2">
            <InputBox
              LabelName="Pan Card Number"
              Name="panNumber"
              Type="text"
              Placeholder="Your Pan Card Number"
            />
          </div>
          <div className="row-span-2 row-start-3 p-5 rounded-lg shadow-lg">
            <InputBox
              LabelName="Driving License Image"
              Name={`licenseImage`}
              Type="file"
              Placeholder="Your Driving License Image"
              className="w-full h-full border-none"
              onChange={(e) => {
                handleImageFileChange(e);
              }}
            />
            {imagePreviews.licenseImage && (
              <div className="flex justify-center items-center gap-3">
                <img
                  src={imagePreviews.licenseImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md border"
                />

                {/* Cancel Button */}
                <button
                  onClick={() => handleImageCancel("licenseImage")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="row-span-2 row-start-3 p-5 rounded-lg shadow-lg">
            <InputBox
              className="w-full h-full border-none"
              LabelName="Aadhar Card Image"
              Name="aadharImage"
              Type="file"
              Placeholder="Your Aadhar Card Image"
              onChange={(e) => {
                handleImageFileChange(e);
              }}
            />
            {imagePreviews.aadharImage && (
              <div className="flex justify-center items-center gap-3">
                <img
                  src={imagePreviews.aadharImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md border"
                />

                {/* Cancel Button */}
                <button
                  onClick={() => handleImageCancel("aadharImage")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="row-span-2 row-start-3 p-5 rounded-lg shadow-lg">
            <InputBox
              LabelName="Pan Card Image"
              Name="panImage"
              Type="file"
              Placeholder="Your Pan Card Image"
              className="w-full h-full border-none"
              onChange={(e) => {
                handleImageFileChange(e);
              }}
            />
            {imagePreviews.panImage && (
              <div className="flex justify-center items-center gap-3">
                <img
                  src={imagePreviews.panImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md border"
                />

                {/* Cancel Button */}
                <button
                  onClick={() => handleImageCancel("panImage")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="col-span-2 row-start-5">
            <InputBox
              LabelName="Password"
              Name="password"
              Type="password"
              Placeholder="Your Password"
            />
          </div>
          <div className="col-start-3 row-start-5 flex justify-center items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vendor
              </label>
              <select
                name="vendorId"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Vendor</option>
                {allVendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            <InputBox
              LabelName="Physical Disability"
              Name="physicallyDisabled"
              Type="checkbox"
              Required={false}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-5 w-full">Vehicle Details</h2>

        <div className="Vehicle-details grid laptop:grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-4">
          {/* Vehicle Type */}

          <div className="grid grid-cols-3 grid-rows-5 gap-4">
            <div className="py-4">
              <label
                htmlFor={"Name"}
                className={`block text-sm font-medium text-gray-700 mb-2 `}
              >
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                className={`w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md `}
              >
                <option value="bike">Bike</option>
                <option value="scooty">Scooty</option>
                <option value="pickup">Pickup</option>
                <option value="truck">Truck</option>
                <option value="Electric Bike"> Electric Bike </option>
                <option value="Electric vehicle (3/4 wheeler)">
                  Electric vehicle (3/4 wheeler)
                </option>
              </select>
            </div>
            <div>
              <InputBox
                LabelName="Plate Number:"
                Name="plateNumber"
                Placeholder="Plate Number"
              />
            </div>
            <div className="row-span-2 col-start-2 row-start-2 rounded-lg shadow-lg">
              <InputBox
                LabelName="Upload RC Front Image:"
                Name="racFrontImage"
                Type="file"
                Placeholder="RC Front Image"
                className="w-full h-full border-none"
                onChange={(e) => {
                  handleImageFileChange(e);
                }}
              />
              {imagePreviews.racFrontImage && (
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={imagePreviews.racFrontImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleImageCancel("racFrontImage")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="col-start-3 row-start-1">
              <InputBox
                LabelName="Insurance Number:"
                Name="insuranceNumber"
                Placeholder="Policy Number"
              />
            </div>
            <div className="col-start-3 row-start-2">
              <InputBox
                LabelName="Insurance Expiry:"
                Name="insuranceExpiry"
                Type="date"
                Placeholder="Policy Expiry Date"
                className="w-full h-full border-none"
                onChange={(e) => {
                  handleImageFileChange(e);
                }}
              />
            </div>
            <div className="row-span-2 col-start-3 row-start-3 rounded-lg shadow-lg">
              <InputBox
                LabelName="Upload Insurance Image:"
                Name="insuranceImage"
                Type="file"
                Placeholder="Insurance Image"
                className="w-full h-full border-none"
                onChange={(e) => {
                  handleImageFileChange(e);
                }}
              />
              {imagePreviews.insuranceImage && (
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={imagePreviews.insuranceImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleImageCancel("insuranceImage")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="row-span-3 col-start-1 row-start-2">
              <div className="">
                <label>Vehicle Description:</label>
                <textarea
                  type="text"
                  name="vehicleDescription"
                  className={`w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md h-96 `}
                  required
                />
              </div>
            </div>
            <div className="row-span-2 col-start-2 row-start-4 rounded-lg shadow-lg">
              <InputBox
                LabelName="Upload RC back Image:"
                Name="racBackImage"
                Type="file"
                Placeholder="RC Back Image"
                className="w-full h-full border-none"
                onChange={(e) => {
                  handleImageFileChange(e);
                }}
              />
              {imagePreviews.racBackImage && (
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={imagePreviews.racBackImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleImageCancel("racBackImage")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="row-start-5 rounded-lg shadow-lg">
              <InputBox
                LabelName="Upload Pollution Certificate:"
                Name="pollutionImage"
                Type="file"
                Placeholder="Insurance Image"
                Required={false}
                className="w-full h-full border-none"
                onChange={(e) => {
                  handleImageFileChange(e);
                }}
              />
              {imagePreviews.pollutionImage && (
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={imagePreviews.pollutionImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleImageCancel("pollutionImage")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="col-start-3 row-start-5 flex justify-end items-end">
              <Button type="submit" className={"w-40  "} label={"Submit"} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(RegisterDriver);
