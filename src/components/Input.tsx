import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  id: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, type = 'text', id, name, error, required = false, className, onChange, ...rest }, ref) => {
    return (
      <div className={clsx("mb-4", className)}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={clsx(
            "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-teal-500 focus:ring-teal-200",
          )}
          onChange={onChange}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;