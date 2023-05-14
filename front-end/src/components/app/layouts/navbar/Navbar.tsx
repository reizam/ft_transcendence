import React from 'react';
import { useAuth } from '@/providers/auth/auth.context';
import { AiOutlinePoweroff } from 'react-icons/ai';
import NavbarItem, {
  NavbarItemProps,
} from '@/components/app/layouts/navbar/NavbarItem';
import Logo from '@/components/app/layouts/header/logo/Logo';

interface NavbarProps {
  items: NavbarItemProps[];
}

function Navbar({ items }: NavbarProps): React.ReactElement {
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col items-center w-32 bg-dark-purple">
      <div className="flex justify-center items-center h-16 w-full">
        <Logo />
      </div>
      <div className="flex flex-col justify-between h-full py-8">
        <div className="flex flex-col space-y-8">
          {items.map((item, index) => (
            <NavbarItem key={index} {...item} />
          ))}
        </div>
        <button onClick={logout}>
          <AiOutlinePoweroff size={24} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
