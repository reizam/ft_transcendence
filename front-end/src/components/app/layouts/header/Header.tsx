import React from 'react';
import headerStyles from '@components/app/layouts/header/header.module.css';
import Logo from '@/components/app/layouts/header/logo/Logo';
import Title from '@/components/app/layouts/header/title/Title';
import Settings from '@/components/app/layouts/header/settings/Settings';

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps): React.ReactElement {
  return (
    <header className={headerStyles.ctn__header}>
      <Logo />
      <Title {...{ title }} />
      <Settings />
    </header>
  );
}

export default Header;
