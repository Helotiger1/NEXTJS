"use client";
import React from "react";

type GenericModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export const GenericModal: React.FC<GenericModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[80vw] h-[80vh] relative overflow-y-auto animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
