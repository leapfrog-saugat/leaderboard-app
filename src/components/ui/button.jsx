import React from 'react';

export function Button({ children, variant = 'default', onClick, className = '', ...props }) {
  const baseStyles = 'px-4 py-2 rounded';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'hover:bg-gray-100'
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
