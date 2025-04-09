'use client';
import React from 'react';

export function Card({ children, ...props }) {
  return <div {...props} className="border rounded p-4 shadow">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
