import React from 'react';
import logoStyles from './logo.module.css';

const Logo: React.FC = () => {
  const borderColor = 'var(--main-theme-color)';

  return (
    <div className={logoStyles.ctn__logo}>
      <h2
        className={logoStyles.h2__logo}
        style={{
          color: borderColor,
          textShadow: `0 0 10px ${borderColor}, 0 0 20px ${borderColor}, 0 0 40px ${borderColor}, 0 0 80px ${borderColor}, 0 0 120px ${borderColor}`,
        }}
      >
        Pong
      </h2>
    </div>
  );
};

export default Logo;
