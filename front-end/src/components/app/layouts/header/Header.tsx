import Theme from '@/components/app/layouts/header/theme/Theme';
import Title from '@/components/app/layouts/header/title/Title';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps): React.ReactElement {
  const [showList, setShowList] = useState(false);

  const handleClick = (): void => {
    setShowList(!showList);
  };

  return (
    <header className="flex flex-row justify-between items-center h-16 px-8 w-full bg-dark-purple">
      <div />
      {showList ? <ThemeSwitcher /> : title ? <Title title={title} /> : <div />}
      <Theme onClick={handleClick} />
    </header>
  );
}

export default Header;
