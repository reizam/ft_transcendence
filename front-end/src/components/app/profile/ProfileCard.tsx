import Avatar from './Avatar';
import TwoFASwitch from './TwoFASwitch';
import Username from './Username';

interface IData {
  username: string;
  has2FA?: boolean;
  profilePicture: string;
}

interface ProfileCardProps {
  canEdit: boolean;
  data: IData;
}

function ProfileCard({ canEdit, data }: ProfileCardProps) {
  return (
    <>
      <Avatar canEdit={canEdit} src={data.profilePicture} />
      <Username canEdit={canEdit} value={data.username} />
      {canEdit && <TwoFASwitch checked={data.has2FA!} />}
    </>
  );
}

export default ProfileCard;
