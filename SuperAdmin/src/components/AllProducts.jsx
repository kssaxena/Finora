import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { VendorProducts } from "../constants/AllProducts.Vendor";

const OurServicesSlider = () => {
  const [offset, setOffset] = useState(0);
  const sliderSpeed = 3000;
  const slideWidth = 320;

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        const maxOffset = slideWidth * (VendorProducts.length - 1);
        return prevOffset >= maxOffset ? 0 : prevOffset + slideWidth;
      });
    }, sliderSpeed);

    return () => clearInterval(interval);
  }, [VendorProducts.length, slideWidth, sliderSpeed]);

  return (
    <div
      className="overflow-hidden relative w-full flex justify-center items-center"
      //   style={{ width: "80vw", left: "10vw" }}
    >
      <div
        className="flex px-20 py-10 gap-5"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: "transform 0.5s ease-in-out",
          width: `${slideWidth * VendorProducts.length}px`,
        }}
      >
        {VendorProducts.map((product, index) => (
          <div
            key={index}
            style={{ flex: "0 0 auto", width: `${slideWidth}px` }}
          >
            <ProductCard
              ProductName={product.ProductName}
              CurrentPrice={product.CurrentPrice}
              Mrp={product.Mrp}
              Rating={product.Rating}
              Offer={product.Offer}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServicesSlider;
