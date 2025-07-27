import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/Loading";

const steps = [
  "Basic Details",
  "Address Details",
  "Bank Details",
  "Business Details",
];

const VendorRegistrationForm = ({ startLoading, stopLoading, onClose }) => {
  const [step, setStep] = useState(0);

  const formRef = useRef(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nextStep = (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);

    // Convert FormData to a plain object
    const formObject = {};
    data.forEach((value, key) => {
      formObject[key] = value;
    });

    // Check for empty fields and alert for the first empty field
    for (const [key, value] of Object.entries(formObject)) {
      if (!value || value.trim() === "") {
        alert(`Please fill the "${key}" field.`);
        return;
      }
    }

    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("vendorRegistrationForm");
    let existingObject = {};
    if (existingData) {
      existingObject = JSON.parse(existingData);
    }
    Object.assign(existingObject, formObject);
    localStorage.setItem(
      "vendorRegistrationForm",
      JSON.stringify(existingObject)
    );
    console.log(existingObject);
    setStep((prev) => prev + 1);
    console.log(step);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);

    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("vendorRegistrationForm");

    let existingObject = {};

    if (existingData) {
      // Parse existing JSON and merge new data
      existingObject = JSON.parse(existingData);
    }

    // Convert existing object into formData
    const existingFormData = new FormData();
    Object.entries(existingObject).forEach(([key, value]) => {
      existingFormData.append(key, value);
    });

    // Append both formData
    for (let [key, value] of existingFormData.entries()) {
      formData.append(key, value);
    }

    try {
      startLoading();
      const response = await FetchData(
        "vendor/register",
        "post",
        formData,
        true
      );
      console.log(response);
      if (response.status === 201) {
        setSuccess("Vendor registered successfully!");
        alert("Please wait until our team completes the verification process.");
        window.location.href = "/";

        setStep(0);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    } finally {
      localStorage.removeItem("vendorRegistrationForm");
      setStep(0);
      onClose();
      stopLoading();
    }
  };

  return (
    <div className='p-6 lg:h-[80vh] w-full bg-white shadow-lg rounded-lg flex flex-col justify-around'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Vendor Registration
      </h1>

      {/* Progress Bar */}
      <div className='relative flex items-center justify-between mb-6 '>
        {steps.map((label, index) => (
          <div key={index} className='flex flex-col items-center w-full'>
            <div
              className={`h-3 w-full ${
                index < step ? "bg-green-500" : "bg-gray-300"
              } transition-all duration-500 rounded-full`}
            />
            <div
              className={`mt-2 px-4 py-1 rounded-full lg:text-sm text-xs font-semibold 
              ${
                index <= step
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {success && <div className='text-green-500 mb-4'>{success}</div>}

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 lg:gap-6'
        >
          {step === 0 && (
            <>
              <InputBox
                LabelName='Business Owner Name'
                Name='name'
                Placeholder='Business Owner Name'
              />
              <InputBox
                LabelName='Email'
                Type='email'
                Name='email'
                Placeholder='Business Owner Email'
              />
              <InputBox
                LabelName='Password'
                Type='password'
                Name='password'
                Placeholder='Enter Password'
              />
              <InputBox
                LabelName='Mobile Number'
                Name='contactNumber'
                Placeholder='Enter Mobile Number'
              />
            </>
          )}

          {step === 1 && (
            <>
              <InputBox
                LabelName='Address'
                Name='address'
                Placeholder='Enter Address'
              />
              <InputBox LabelName='City' Name='city' Placeholder='Enter City' />
              <InputBox
                LabelName='State'
                Name='state'
                Placeholder='Enter State'
              />
              <InputBox
                LabelName='Country'
                Name='country'
                Placeholder='Enter Country'
              />
              <InputBox
                LabelName='Postal Code'
                Name='postalCode'
                Placeholder='Enter Postal Code'
              />
            </>
          )}

          {step === 2 && (
            <>
              {/* <InputBox
                LabelName="Business Name"
                Name="businessName"
                
                Placeholder="Enter Business Name"
                
              /> */}
              {/* <InputBox
                LabelName="GST Number"
                Name="gstNumber"
                
                Placeholder="Enter GST Number"
                
              /> */}
              <InputBox
                LabelName='Account Holder Name'
                Name='accountHolderName'
                Placeholder='Enter Account Holder Name'
              />
              <InputBox
                LabelName='Account Number'
                Name='accountNumber'
                Placeholder='Enter Account Number'
              />
              <InputBox
                LabelName='Bank Name'
                Name='bankName'
                Placeholder='Enter Bank Name'
              />
              <InputBox
                LabelName='IFSC Code'
                Name='ifscCode'
                Placeholder='Enter IFSC Code'
              />
            </>
          )}

          {step === 3 && (
            <>
              <InputBox
                LabelName='Business Name'
                Name='businessName'
                Placeholder='Enter Business Name'
              />
              <InputBox
                LabelName='Pan Number'
                Name='panNumber'
                Placeholder='Enter PAN Number'
              />
              <InputBox
                LabelName='GST Number'
                Name='gstNumber'
                Placeholder='Enter GST Number'
              />
              <InputBox
                Type='file'
                Name={"image"}
                LabelName={"Upload your G.S.T certificate"}
              />
              <InputBox
                Type='file'
                Name={"canceledCheque"}
                LabelName={"Cancelled Cheque"}
              />
            </>
          )}

          <div className='md:col-span-2 flex justify-between'>
            {step > 0 && (
              <Button
                label='Back'
                onClick={prevStep}
                className=' hover:bg-red-500'
              />
            )}
            {step < 3 ? (
              <Button label='Next' onClick={nextStep} className={"w-1/3"} />
            ) : (
              <Button label='Register Vendor' Type='submit' className='w-1/3' />
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoadingUI(VendorRegistrationForm);
