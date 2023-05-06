import Header from '@/components/app/layouts/header/Header';
import Navbar from '@/components/app/layouts/navbar/Navbar';
import Head from 'next/head';
import React from 'react';
import { ToastContainer } from 'react-toastify';

export enum Mode {
  WITH_LAYOUT = 'withLayout',
  WITHOUT_LAYOUT = 'withoutLayout',
}

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
  mode = Mode.WITH_LAYOUT,
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
      {mode === Mode.WITH_LAYOUT ? (
        <>
          <Navbar />
          <Header {...{ title }} />
        </>
      ) : null}
      <main className={className}>{children}</main>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Layout;
