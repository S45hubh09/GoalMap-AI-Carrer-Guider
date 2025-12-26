import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  required?: boolean;
  helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false,
  helperText
}) => {
  return (
    <div className="mb-4 group">
      <label htmlFor={name} className="block text-sm font-medium text-green-300 mb-1 transition-colors group-hover:text-green-200">
        {label} {required && <span className="text-green-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg 
            focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all duration-300
            hover:border-green-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]
            min-h-[100px] placeholder-gray-600 backdrop-blur-sm"
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg 
            focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all duration-300
            hover:border-green-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]
            placeholder-gray-600 backdrop-blur-sm"
        />
      )}
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};

export default InputField;