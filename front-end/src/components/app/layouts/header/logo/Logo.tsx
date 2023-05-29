import { useTheme } from '@/providers/theme/theme.context';
import Link from 'next/link';
import React from 'react';
import logoStyles from './logo.module.css';

function Logo(): React.ReactElement {
  const { theme } = useTheme();

  return (
    <div className={logoStyles.ctn__logo}>
      <Link href="/">
        <h2
          className={logoStyles.h2__logo}
          style={{
            color: theme.colors.primary,
            textShadow: `0 0 10px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary}, 0 0 40px ${theme.colors.primary}, 0 0 80px ${theme.colors.primary}, 0 0 120px ${theme.colors.primary}`,
          }}
        >
          Pong
        </h2>
      </Link>
    </div>
  );
}

export default Logo;
