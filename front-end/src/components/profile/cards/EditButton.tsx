import styleButton from '@/components/profile/cards/EditButton.module.css';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';

interface ButtonProps<T = MouseEventHandler<HTMLButtonElement>> {
  children?: ReactNode;
  onClick?: T;
  isEditing?: boolean;
}

function Button({
  children,
  onClick,
  isEditing = false,
}: ButtonProps): ReactElement {
  return (
    <>
      <button
        className={`${styleButton.style__button} ${
          isEditing ? styleButton.style__button__editing : ''
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
