import { MouseEventHandler, ReactElement } from 'react';
import styleButton from '@/components/profile/cards/EditButton.module.css';

interface ButtonProps<T = MouseEventHandler<HTMLButtonElement>> {
  name?: string;
  onClick?: T;
  isEditing?: boolean;
}

function Button({
  name,
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
        {name}
      </button>
    </>
  );
}

export default Button;
