// PasswordToggle.tsx
import React, { MouseEvent } from 'react';
import Image from 'next/image';

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({ showPassword, onToggle }) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        className="w-full px-4 py-3 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
      >
        {showPassword ? (
          <Image
            src="/assets/Eye Open.png"
            className="items-center pt-2"
            alt=""
            width={20}
            height={20}
          />
        ) : (
          <Image
            src="/assets/Eye cross.png"
            className=" items-center pt-2"
            alt=""
            width={20}
            height={20}
          />
        )}
      </button>
    </div>
  );
};

export default PasswordToggle;
