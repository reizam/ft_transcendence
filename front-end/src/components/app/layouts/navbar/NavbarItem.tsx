import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface NavbarItemProps {
  href: string;
  icon: React.ReactNode;
}

function NavbarItem({ href, icon }: NavbarItemProps): React.ReactElement {
  const router = useRouter();

  const isActive = router.pathname.startsWith(href);

  return (
    <Link href={href}>
      <div
        style={{
          boxShadow: isActive ? '0 0 10px var(--main-theme-color)' : 'none',
        }}
        className="hover:bg-purple/50 bg-purple/25 p-4 rounded-full ease-in-out duration-300 transition-all"
      >
        {icon}
      </div>
    </Link>
  );
}

export default NavbarItem;
