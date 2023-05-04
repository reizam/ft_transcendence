import React, { useState } from 'react';
import styleButton from './Button.module.css';

// How to give ButtonProps a defined type in the Parent component
// type MyFunctionType = (arg1: number, arg2: string) => void;

// const myButtonProps: ButtonProps<MyFunctionType> = {
//   initialName: 'My Button',
//   setHasClicked: (arg1: number, arg2: string) => {
//     // Your implementation here
//   },
// };

interface ButtonProps<T = (...args: never[]) => void> {
  initialName: string;
  onClickName?: string;
  onClick?: T;
}

function Button({ initialName, onClickName, onClick }: ButtonProps) {
  const [name, setName] = useState(initialName);

  console.log('name =', name);
  return (
    <>
      <button
        className={styleButton.style__button}
        onClick={() => {
          setName(
            !!onClickName && name === initialName ? onClickName : initialName
          );
          !!onClick && onClick();
        }}
      >
        {name}
      </button>
    </>
  );
}

export default Button;
