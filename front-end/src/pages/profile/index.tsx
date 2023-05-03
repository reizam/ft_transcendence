import { useGetMe } from '@/api/user/user.api';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';
import Layout from '@/components/app/layouts/Layout';
import ProfileContent from '@/components/profile/ProfileContent';

function Profile(): ReactElement {
  const { data, isLoading, isError } = useGetMe();

  if (isLoading) return <LoadingScreen />;

  if (isError) return <p>No profile data</p>;

  return (
    <Layout title="Profile">
      <ProfileContent canEdit userData={data} />
    </Layout>
  );
}

export default withProtected(Profile);
