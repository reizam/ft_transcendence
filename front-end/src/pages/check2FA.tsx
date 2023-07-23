import Check2FA from '@/components/login/Check2FA';
import { NextPage } from 'next';
import { withProtected } from '@/providers/auth/auth.routes';

const check2FA: NextPage = () => {
  return <Check2FA />;
};

export default withProtected(check2FA);
