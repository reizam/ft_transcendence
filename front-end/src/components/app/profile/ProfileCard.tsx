import { useContext } from 'react';
import Avatar from './Avatar';
import { ProfileEditContext } from './ProfileEditContext';
import TwoFASwitch from './TwoFASwitch';
import Username from './Username';

interface IData {
  username: string;
  has2FA?: boolean;
  profilePicture: string;
}

interface ProfileCardProps {
  data: IData;
}

function ProfileCard({ data }: ProfileCardProps) {
  const canEdit = useContext(ProfileEditContext);
  return (
    <>
      <Avatar src={data.profilePicture} />
      <Username value={data.username} />
      {canEdit && <TwoFASwitch checked={data.has2FA!} />}
    </>
  );
}

export default ProfileCard;
