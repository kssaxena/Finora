import React from "react";

const OrderCard = ({ title, count, color, icon }) => {
  return (
    <div
      className={`p-4 rounded shadow-md text-white ${color} flex items-center`}
    >
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      {icon && <div className="text-4xl">{icon}</div>}
    </div>
  );
};

export default OrderCard;
