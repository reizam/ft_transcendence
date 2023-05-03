import Layout, { Mode } from '@/components/app/layouts/Layout';
import LoginContent from '@/components/login/LoginContent';
import { withPublic } from '@/providers/auth/auth.routes';
import { NextPage } from 'next';

const Login: NextPage = () => {
  return (
    <Layout
      className="flex items-center justify-center h-screen bg-dark-purple"
      title="Connexion"
      mode={Mode.WITHOUT_LAYOUT}
    >
      <LoginContent />
    </Layout>
  );
};

export default withPublic(Login);
