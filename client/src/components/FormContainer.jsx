// client/components/FormContainer.jsx

import React from 'react';

const FormContainer = ({ children }) => {
  return (
    // Add pt-24 (for the navbar) and pb-12 (for bottom space)
    <div className="flex justify-center items-start pt-24 pb-12 min-h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-xl
                      dark:bg-gray-800 dark:border dark:border-gray-700">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;