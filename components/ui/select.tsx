'use client';
import React from 'react';

type SelectProps = {
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <div data-value={value}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onValueChange });
        }
        return child;
      })}
    </div>
  );
}

type SelectTriggerProps = React.HTMLProps<HTMLButtonElement>;

export function SelectTrigger(props: SelectTriggerProps) {
  return <button {...props}>{props.children}</button>;
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  onValueChange?: (val: string) => void;
};

export function SelectItem({ value, children, onValueChange }: SelectItemProps) {
  return (
    <div
      onClick={() => onValueChange?.(value)}
      className="cursor-pointer px-2 py-1 hover:bg-gray-100"
    >
      {children}
    </div>
  );
}
