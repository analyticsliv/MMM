// SocialButton.tsx
import React, { MouseEvent, ReactNode } from 'react';
import Image from 'next/image';

interface SocialButtonProps {
  src: string;
  alt: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ src, alt, onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex h-16 my-2 justify-center text-center items-center border border-black"
    >
      <Image src={src} className="mr-2" alt={alt} width={12} height={12} />
      {children}
    </button>
  );
};

export default SocialButton;
