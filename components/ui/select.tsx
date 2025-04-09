'use client';
import React from 'react';

export function Select({ children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ children, ...props }) {
  return <button {...props} className="border rounded px-2 py-1 w-full">{children}</button>;
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div className="border rounded mt-1 bg-white shadow">{children}</div>;
}

export function SelectItem({ children, ...props }) {
  return <div {...props} className="px-2 py-1 hover:bg-gray-100 cursor-pointer">{children}</div>;
}
