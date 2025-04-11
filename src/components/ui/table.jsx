import React from 'react';

export function Table({ children, ...props }) {
  return <table className='w-full border-collapse' {...props}>{children}</table>;
}

export function TableHeader({ children, ...props }) {
  return <thead className='bg-gray-50' {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }) {
  return <tbody className='divide-y' {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }) {
  return <tr className='hover:bg-gray-50' {...props}>{children}</tr>;
}

export function TableHead({ children, ...props }) {
  return <th className='py-3 px-4 text-left font-medium' {...props}>{children}</th>;
}

export function TableCell({ children, ...props }) {
  return <td className='py-3 px-4' {...props}>{children}</td>;
}
