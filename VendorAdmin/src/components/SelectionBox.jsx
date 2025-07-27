const SelectBox = ({
  LabelName,
  Name,
  Value,
  Placeholder,
  Options = [], // Ensure it's always an array
  onChange,
  className = "",
  className2 = "",
}) => {
  return (
    <div className={`mb-4 py-4 ${className2}`}>
      <label
        htmlFor={Name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {LabelName}
      </label>
      <select
        id={Name}
        name={Name}
        value={Value}
        onChange={onChange}
        className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
      >
        <option value="" className="text-gray-800" disabled selected>
          {Placeholder}
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
