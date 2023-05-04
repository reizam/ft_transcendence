import React, { useState } from 'react';
import styleButton from './Button.module.css';

interface ButtonProps {
  initialName: string;
  onClickName?: string;
}

function Button(props: ButtonProps) {
  const { initialName, onClickName } = props;
  const [name, setName] = useState(initialName);

  return (
    <>
      <button
        className={styleButton.style__button}
        onClick={() =>
          setName(
            !!onClickName && name === initialName ? onClickName : initialName
          )
        }
      >
        {name}
      </button>
    </>
  );
}

export default Button;
