// client/src/components/FormContainer.jsx

import React from 'react';

// Basic inline styles for our container
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const formBoxStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '2rem',
  background: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '8px',
};

const FormContainer = ({ children }) => {
  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>{children}</div>
    </div>
  );
};

export default FormContainer;