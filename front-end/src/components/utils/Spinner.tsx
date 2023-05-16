import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

interface SpinnerProps {
  size?: number;
  className?: string;
}

function Spinner({ size = 16, className }: SpinnerProps): React.ReactElement {
  return (
    <div className={className}>
      <ImSpinner8 className="animate-spin" size={size} />
    </div>
  );
}

export default Spinner;
