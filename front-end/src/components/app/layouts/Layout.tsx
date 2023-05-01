import Head from 'next/head';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function Layout({ title, children, className }: LayoutProps) {
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

      <main className={className}>{children}</main>
    </>
  );
}

export default Layout;
