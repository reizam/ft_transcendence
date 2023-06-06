import React, { ReactElement } from 'react';

interface BasicInputProps {
  disabled?: boolean;
  type?: string;
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
      onKeyPress={onKeyPress}
      disabled={disabled}
      type={type}
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
