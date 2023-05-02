import { IUserData } from '@/api/profile/profile.type';
import { ReactElement, useContext } from 'react';
import Avatar from './Avatar';
import { ProfileEditContext } from './ProfileEditContext';
import TwoFASwitch from './TwoFASwitch';
import Username from './Username';

interface IData {
  username: string;
  has2FA?: boolean;
  profilePicture: string;
}

interface UserDataProps {
  userData: IUserData;
}

function ProfileCard({ userData }: UserDataProps): ReactElement {
  const canEdit = useContext(ProfileEditContext);
  return (
    <>
      <Avatar src={userData.profilePicture} />
      <Username value={userData.username} />
      {canEdit && <TwoFASwitch checked={userData.has2FA!} />}
    </>
  );
}

export default ProfileCard;
