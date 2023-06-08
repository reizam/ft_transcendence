import Theme from '@/components/app/layouts/header/theme/Theme';
import Title from '@/components/app/layouts/header/title/Title';
import React from 'react';

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps): React.ReactElement {
  return (
    <header className="flex flex-row justify-between items-center h-16 px-8 w-full bg-dark-purple">
      <div />
      {title ? <Title title={title} /> : <div />}
      <Theme />
    </header>
  );
}

export default Header;
