import { useGetFriends } from '@/api/friends/friends.get.api';
import Layout from '@/components/app/layouts/Layout';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import UsersList from '@/components/friends/FriendsList';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';
import FrStyles from "@/styles/friends.module.css";

function Friends(): ReactElement {
  const { data, isLoading, isError } = useGetFriends();

  if (isLoading) return <LoadingScreen />;

  if (isError || !data) return <p>No profile data</p>;

  return (
    <Layout title="Friends">
      {isLoading ? (
        <LoadingScreen />
      ) : data ? (
        <>
        <div className={FrStyles.ctn__friends_section}>
          <div className={FrStyles.ctn__friends}>
            <UsersList users={data.friends} isFriend={true}/>
          </div>
          <div className={FrStyles.ctn__friends}>
            <UsersList users={data.nonFriends} isFriend={false} />
          </div>
        </div>
        </>
      ) : (
        <p>No data</p>
      )}
    </Layout>
  );
}

export default withProtected(Friends);
