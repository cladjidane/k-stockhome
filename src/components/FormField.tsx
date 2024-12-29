import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'select';
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  helpText?: string;
  min?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
  helpText,
  min,
  children,
  className = '',
}: FormFieldProps) {
  const id = `field-${name}`;
  const baseInputClass = "mt-1 block w-full p-2 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200";

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative mt-1">
        {type === 'select' ? (
          <div className="relative">
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className={`${baseInputClass} pr-8 appearance-none`}
            >
              {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            min={min}
            className={baseInputClass}
          />
        )}
      </div>
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
