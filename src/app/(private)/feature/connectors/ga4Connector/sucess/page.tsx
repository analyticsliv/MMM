'use client';
import React from "react";
import { useState } from "react";
import SuccessModal from "./success"; // Assuming success.tsx is in the same folder.

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">Open Success Modal</button>

      {isModalOpen && (
        <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Page;