import React from 'react';
import { FaPaintRoller } from 'react-icons/fa';

interface ThemeProps {
  onClick?: () => void;
}

function Theme({ onClick }: ThemeProps): React.ReactElement {
  return (
    <button>
      <FaPaintRoller size={24} onClick={onClick} />
    </button>
  );
}

export default Theme;
