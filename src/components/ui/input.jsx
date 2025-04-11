import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    />
  );
}
