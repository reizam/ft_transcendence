import Button from '@/components/app/button/Button';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({ profileData, canEdit }: ProfileDataProps): ReactElement {
  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar src={profileData.profilePicture} canEdit={canEdit} />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={profileData.username}
      />
      {canEdit && <ToggleSwitch checked={profileData.has2FA} />}
      <Button />
    </div>
  );
}

export default ProfileCard;
