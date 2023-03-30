import React from "react";

interface BasicInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function BasicInput({
  type,
  name,
  placeholder,
  value,
  onChange,
  className,
}: BasicInputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

export default BasicInput;
