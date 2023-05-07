import { MouseEventHandler, ReactElement } from 'react';
import styleButton from './Button.module.css';

// How to give ButtonProps a defined type in the Parent component
// type MyFunctionType = (arg1: number, arg2: string) => void;

// const myButtonProps: ButtonProps<MyFunctionType> = {
//   initialName: 'My Button',
//   setHasClicked: (arg1: number, arg2: string) => {
//     // Your implementation here
//   },
// };

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
