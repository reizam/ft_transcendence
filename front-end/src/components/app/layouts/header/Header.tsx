import React from 'react';
import Title from '@/components/app/layouts/header/title/Title';
import Settings from '@/components/app/layouts/header/settings/Settings';

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps): React.ReactElement {
  return (
    <header className="flex flex-row justify-between items-center h-16 px-8 w-full bg-dark-purple">
      <div />
      {title ? <Title title={title} /> : <div />}
      <Settings />
    </header>
  );
}

export default Header;
