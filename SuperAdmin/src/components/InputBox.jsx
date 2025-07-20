import React from "react";

const InputBox = ({
  LabelName,
  Placeholder,
  className = "",
  Type = "text",
  Name,
  Value,
  onChange,
  Required = true,
  Disabled = false,
  Ref,
  OnInput,
}) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="py-4 w-full">
        <label
          htmlFor={Name}
          className={`block text-sm font-medium text-gray-700 mb-2 `}
        >
          {LabelName}
        </label>
        <input
          id={Name}
          name={Name}
          type={Type}
          value={Value}
          onChange={onChange}
          onInput={OnInput}
          placeholder={Placeholder}
          required={Required}
          ref={Ref}
          className={`w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className} h-full `}
          disabled={Disabled}
        />
      </div>
    </div>
  );
};

export default InputBox;
