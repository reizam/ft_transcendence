import Profile from '@/components/app/profile/Profile';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { BACKEND_URL } from '@/constants/env';
import { withProtected } from '@/providers/auth/auth.routes';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface IUserData {
  username: string;
  profilePicture: string;
  createdAt: string;
  fortytwoId: number;
}

const INITIAL_STATE: IUserData = {
  username: '',
  profilePicture: '',
  createdAt: '',
  fortytwoId: 0,
};

function UserProfile() {
  const [userData, setUserData] = useState<IUserData>(INITIAL_STATE);
  const [isLoading, setLoading] = useState(true);
  const jwtToken = getCookie('jwt');

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setLoading(true);
    if (router.isReady) {
      fetch(BACKEND_URL + '/profile/' + id, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => res.json())
        .then(({ username, profilePicture, createdAt, fortytwoId }) => {
          setUserData({
            username,
            profilePicture,
            createdAt,
            fortytwoId,
          });
          setLoading(false);
        })
        .catch((error) => console.error(`Could not fetch user data: ${error}`));
    }
  }, [router.isReady]);

  if (isLoading) return <LoadingScreen />;
  if (!userData) return <p>No profile data</p>;

  return <Profile canEdit={false} userData={userData} />;
}

export default withProtected(UserProfile);
