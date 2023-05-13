import React from 'react';
import Head from 'next/head';
import Header from '@/components/app/layouts/header/Header';
import Navbar from '@/components/app/layouts/navbar/Navbar';

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
        <>
          <Navbar />
          <Header {...{ title }} />
        </>
      ) : null}
      <main className={className}>{children}</main>
    </>
  );
}

export default Layout;
