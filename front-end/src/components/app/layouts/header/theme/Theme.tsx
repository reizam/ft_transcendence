import React, { useState } from 'react';
import { FaPaintRoller } from 'react-icons/fa';
import gameStyle from '@/styles/game.module.css';

interface ThemeProps {
  onClick: () => void;
}

function Theme({ onClick }: ThemeProps): React.ReactElement {
  const [clicked, setCliked] = useState(false);

  const handleClick = (): void => {
    setCliked(!clicked);
    onClick();
  };

  const iconClass = clicked ? gameStyle.paint_color : gameStyle.paint_classic;

  return (
    <button>
      <FaPaintRoller size={24} className={iconClass} onClick={handleClick} />
    </button>
  );
}

export default Theme;
