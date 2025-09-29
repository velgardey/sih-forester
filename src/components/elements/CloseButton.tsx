'use client'; 

import React from 'react';

export default function CloseButton() {
  return (
    <button
      style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#333',
      }}
      onClick={() => window.history.back()}
    >
      &times;
    </button>
  );
}