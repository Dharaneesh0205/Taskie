import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      id,
      type = 'text',
      placeholder,
      required,
      error,
      className,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          className={className}
          {...inputProps}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';