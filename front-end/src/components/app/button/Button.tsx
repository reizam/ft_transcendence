import { MouseEventHandler, ReactElement } from 'react';
import styleButton from './Button.module.css';

interface ButtonProps<T = MouseEventHandler<HTMLButtonElement>> {
  name?: string;
  onClick?: T;
}

function Button({ name, onClick }: ButtonProps): ReactElement {
  return (
    <>
      <button className={styleButton.style__button} onClick={onClick}>
        {name}
      </button>
    </>
  );
}

export default Button;
