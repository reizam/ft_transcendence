import React, { ReactElement } from 'react';

interface BasicInputProps {
  disabled?: boolean;
  type?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  checked?: boolean;
  accept?: string;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function BasicInput({
  disabled,
  accept,
  type,
  pattern,
  minLength,
  maxLength,
  name,
  placeholder,
  value,
  onChange,
  className,
  checked,
  onKeyPress,
}: BasicInputProps): ReactElement {
  return (
    <input
      onKeyDown={onKeyPress}
      disabled={disabled}
      type={type}
      pattern={pattern}
      minLength={minLength}
      maxLength={maxLength}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      checked={checked}
      accept={accept}
    />
  );
}

export default BasicInput;
