import Profile from '@/components/app/profile/Profile';
import { ProfileEditContext } from '@/components/app/profile/ProfileEditContext';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { BACKEND_URL } from '@/constants/env';
import { withProtected } from '@/providers/auth/auth.routes';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface IUserData {
  username: string;
  has2FA: boolean;
  profilePicture: string;
  createdAt: string;
  fortytwoId: number;
}

const INITIAL_STATE: IUserData = {
  username: '',
  has2FA: false,
  profilePicture: '',
  createdAt: '',
  fortytwoId: 0,
};

function MyProfile() {
  const [userData, setUserData] = useState<IUserData>(INITIAL_STATE);
  const [isLoading, setLoading] = useState(true);
  const jwtToken = getCookie('jwt');

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(({ username, has2FA, profilePicture, createdAt, fortytwoId }) => {
        setUserData({
          username,
          has2FA,
          profilePicture,
          createdAt,
          fortytwoId,
        });
        setLoading(false);
      })
      .catch((error) => console.error(`Could not fetch user data: ${error}`));
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (!userData) return <p>No profile data</p>;

  return (
    <ProfileEditContext.Provider value={true}>
      <Profile userData={userData} />;
    </ProfileEditContext.Provider>
  );
}

export default withProtected(MyProfile);
