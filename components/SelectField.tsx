import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, required = false }) => {
  return (
    <div className="mb-4 group">
      <label htmlFor={name} className="block text-sm font-medium text-green-300 mb-1 transition-colors group-hover:text-green-200">
        {label} {required && <span className="text-green-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg 
          focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all duration-300
          hover:border-green-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]
          backdrop-blur-sm appearance-none cursor-pointer"
        style={{ colorScheme: 'dark' }} 
      >
        <option value="" disabled className="bg-black text-gray-500">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-zinc-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;