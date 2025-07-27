import React from "react";
import Button from "../../Components/Button";
import PopUp from "../../Components/PopUpWrapper";
import { useState, useRef } from "react";
import InputBox from "../../Components/InputBox";
import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";
import SelectBox from "../../Components/SelectionBox";

const Promotion = ({ startLoading, stopLoading }) => {
  const [popup, setPopup] = useState({
    addPromotion: false,
  });
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    startLoading();

    try {
      // startLoading();
      const response = await FetchData("promotion/", "post", formData, true);

      console.log(response);
      alert(response.data.message);
      setPopup((prev) => {
        return { ...prev, addPromotion: false };
      });
    } catch (err) {
      console.log(err);
      alert("Failed to Add the promotion! Please try again");
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <Button
        label={"Add promotions"}
        onClick={() =>
          setPopup((prev) => {
            return { ...prev, addPromotion: true };
          })
        }
      />
      {popup?.addPromotion && (
        <PopUp
          onClose={() =>
            setPopup((prv) => {
              return { ...prv, addPromotion: false };
            })
          }
        >
          <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-center items-center z-50">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-4 gap-5"
            >
              <InputBox
                LabelName="Title"
                Type="text"
                Name="title"
                Placeholder="Enter promotion title"
                Required={true}
              />
              <InputBox
                LabelName="Description"
                Type="text"
                Name="description"
                Placeholder="Enter description"
                Required={true}
              />
              <InputBox
                LabelName="Discount (In terms of Rs)"
                Type="number"
                Name="discountValue"
                Placeholder="Enter discount percentage"
                Required={true}
              />
              <SelectBox
                LabelName="Select Type"
                Name="type"
                Options={[
                  { title: "flat_discount", value: "flat_discount" },
                  {
                    title: "percentage_discount",
                    value: "percentage_discount",
                  },
                  { title: "buy_x_get_y", value: "buy_x_get_y" },
                ]}
                Placeholder="Select one option"
                Required={true}
              />
              <InputBox
                LabelName="Start Date"
                Type="date"
                Name="startDate"
                Required={true}
                Min={new Date().toISOString().split("T")[0]} // Restricts past dates
              />
              <InputBox
                LabelName="End Date"
                Type="date"
                Name="endDate"
                Required={true}
                Min={new Date().toISOString().split("T")[0]} // Restricts past dates
              />
              <InputBox
                LabelName="Promo Code"
                Type="text"
                Name="promoCode"
                Placeholder="Enter promo code"
                Required={true}
              />
              <InputBox
                LabelName="Minimum Purchase Amount"
                Type="number"
                Name="minPurchase"
                Placeholder="Enter min purchase amount"
                Required={false}
              />
              <InputBox
                LabelName="Usage Limit"
                Type="number"
                Name="usageLimit"
                Placeholder="No. of time users can use"
                Required={false}
              />
              <SelectBox
                LabelName="User Eligibility"
                Name="userEligibility"
                Options={[
                  { title: "all", value: "all" },
                  {
                    title: "new_users",
                    value: "new_users",
                  },
                  { title: "specific_users", value: "specific_users" },
                ]}
                Placeholder="Enter user eligibility"
                Required={false}
              />
              <InputBox
                LabelName="Image for Large Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
              <InputBox
                LabelName="Image for Medium Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
              <InputBox
                LabelName="Image for Small Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
            </form>
            <Button
              label={"Submit"}
              type={"submit"}
              onClick={handleSubmit}
              className={`h-fit w-fit`}
            />
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default LoadingUI(Promotion);
