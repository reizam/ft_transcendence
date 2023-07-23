import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import { NextPage } from 'next';
import styleLogo from '@/styles/login.module.css';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <Layout className="flex items-center justify-center h-screen" title="Home">
      <Link href="https://www.ponggame.org/">
        <div className="flex flex-col space-y-16">
          <h2 className={styleLogo.main_logo}>Not our Pong!</h2>
        </div>
      </Link>
    </Layout>
  );
};

export default withProtected(Home);
