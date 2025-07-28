const SelectBox = ({
  LabelName,
  Name,
  Value,
  Placeholder,
  Options = [],
  onChange,
  className = "",
  className2 = "",
}) => {
  return (
    <div className={` py-4 ${className2} w-full`}>
      <label
        htmlFor={Name}
        className="block text-sm font-medium mb-2"
      >
        {LabelName}
      </label>
      <select
        id={Name}
        name={Name}
        value={Value}
        onChange={onChange}
        className={`w-full px-4 py-2 bg-black border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className} h-full `}
      >
        <option value="" className="text-gray-800" disabled>
          {Placeholder || "Select an option"}
        </option>
        {Options.map((option) => (
          <option
            key={option.value || option._id}
            value={option.value || option._id}
          >
            {option.label || option.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
