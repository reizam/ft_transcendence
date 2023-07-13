import Header from '@/components/app/layouts/header/Header';
import Navbar from '@/components/app/layouts/navbar/Navbar';
import { NavbarItemProps } from '@/components/app/layouts/navbar/NavbarItem';
import { FaGamepad, FaUser, FaAddressBook } from 'react-icons/fa';
import { BsChatTextFill } from 'react-icons/bs';
import Head from 'next/head';

const navbarItems: NavbarItemProps[] = [
  {
    href: '/profile',
    icon: <FaUser size={24} />,
  },
  {
    href: '/chat',
    icon: <BsChatTextFill size={24} />,
  },
  {
    href: '/game',
    icon: <FaGamepad size={24} />,
  },
  {
    href: '/friends',
    icon: <FaAddressBook size={24} />,
  },
];

export type Mode = 'withLayout' | 'withoutLayout';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  loading?: boolean;
  mode?: Mode;
}

function Layout({
  title,
  children,
  className,
  mode = 'withLayout',
}: LayoutProps): React.ReactElement {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>
          {title ? `${title} - ft_transcendence` : 'ft_transcendence'}
        </title>
      </Head>
      {mode === 'withLayout' ? (
        <div className="flex flex-row w-full">
          <Navbar items={navbarItems} />
          <div className="flex flex-col w-full">
            <Header title={title} />
            <main
              style={{
                height: 'calc(100vh - 4rem)',
              }}
              className={className}
            >
              {children}
            </main>
          </div>
        </div>
      ) : (
        <main className={className}>{children}</main>
      )}
    </>
  );
}

export default Layout;
