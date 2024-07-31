// FormInput.tsx
import React, { ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block w-full text-lg text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 text-lg py-3 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none rounded-md"
      />
      {error && <div className="text-red-default text-sm">{error}</div>}
    </div>
  );
};

export default FormInput;
