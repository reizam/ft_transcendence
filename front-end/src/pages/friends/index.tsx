import { useGetFriends } from '@/api/friends/friends.get.api';
import Layout from '@/components/app/layouts/Layout';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import UsersList from '@/components/friends/FriendsList';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';
import FrStyles from '@/styles/friends.module.css';

function Friends(): ReactElement {
  const { data, isLoading, isError } = useGetFriends();

  return (
    <Layout title="Friends">
      {isLoading ? (
        <LoadingScreen />
      ) : isError || !data ? (
        <p>No profile data</p>
      ) : (
        <>
          <div className={FrStyles.ctn__friends_section}>
            <div className={FrStyles.ctn__friends}>
              <UsersList users={data.friends} isFriend={true} />
            </div>
            <div className={FrStyles.ctn__friends}>
              <UsersList users={data.nonFriends} isFriend={false} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withProtected(Friends);
