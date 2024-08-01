import React, { ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  className?: string; // Added className prop for additional styling
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  className, // Use className prop
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block text-lg text-gray-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 mt-2 text-base border border-primary-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default FormInput;
// // FormInput.tsx
// import React, { ChangeEvent } from "react";

// interface FormInputProps {
//   label: string;
//   type: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   placeholder: string;
//   error?: string;
// }

// const FormInput: React.FC<FormInputProps> = ({
//   label,
//   type,
//   value,
//   onChange,
//   placeholder,
//   error,
// }) => {
//   return (
//     <div className="mb-4">
//       <label className="block w-full text-lg text-gray-600">{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full px-4 text-lg py-3 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none rounded-md"
//       />
//       {error && <div className="text-red-default text-sm">{error}</div>}
//     </div>
//   );
// };

// export default FormInput;
