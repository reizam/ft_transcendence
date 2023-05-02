import React, { ReactElement } from 'react';

interface BasicInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  checked?: boolean;
  accept?: string;
}

function BasicInput({
  accept,
  type,
  name,
  placeholder,
  value,
  onChange,
  className,
  checked,
}: BasicInputProps): ReactElement {
  return (
    <input
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
