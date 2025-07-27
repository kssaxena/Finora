import React from "react";

const ProductCard = ({ ProductName, CurrentPrice, Mrp, Rating, Offer }) => {
  return (
    <div className="whiteSoftBG shadow-md hover:shadow-lg h-96 w-80 overflow-hidden rounded-lg hover:scale-105 duration-300 ease-in-out">
      <div className="text-2xl h-2/3 p-2">hello product card</div>
      <div className="h-1/3 px-5 py-3 gap-2 flex flex-col ">
        <h1 className="text-2xl font-semibold">{ProductName}</h1>
        <div className="flex w-full justify-start items-center gap-10">
          <h1 className="text-xl">₹ {CurrentPrice}</h1>
          <h1 className="">Original Price: ₹ {Mrp}</h1>
        </div>
        <div className="flex justify-start items-center w-full gap-10">
          <h1>{Rating}</h1>
          <h1>{Offer}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
