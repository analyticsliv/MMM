// Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label }) => {
  return (
    <div className="mt-4 flex items-center">
      <input
        type="checkbox"
        id={id}
        className="mr-2 w-7 h-7 rounded-none border-none shadow-gray-600 accent-secondary-900"
      />
      <label htmlFor={id} className="text-base">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
