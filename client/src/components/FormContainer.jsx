// client/components/FormContainer.jsx

import React from 'react';

const FormContainer = ({ children }) => {
  return (
    // Tailwind classes: Flex, center content, margin-top (mt-8), shadow-xl
    <div className="flex justify-center items-start pt-8 min-h-screen">
      {/* Tailwind classes: Max width (max-w-xl), padding, background, rounded, shadow */}
      <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;