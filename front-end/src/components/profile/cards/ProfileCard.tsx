import { useUpdateMe } from '@/api/user/user.patch.api';
import Button from '@/components/app/button/Button';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';
import React, { FormEvent, useRef, useState } from 'react';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({
  profileData,
  canEdit,
}: ProfileDataProps): React.ReactElement {
  const [username, setUsername] = useState(profileData.username);
  const prevUsername = useRef(username);
  const [checked, setChecked] = useState(profileData.has2FA);
  const prevChecked = useRef(checked);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate } = useUpdateMe();
  const onChangeUsername = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { username: e.currentTarget.value },
      { onError: () => setUsername(prevUsername.current) }
    );
    setUsername(e.currentTarget.value);
    setIsEditing(false);
  };
  const onToggle = (isChecked: boolean) => {
    mutate(
      { has2FA: isChecked },
      { onError: () => setChecked(prevChecked.current) }
    );
    setChecked(isChecked);
  };
  const onClick = () => setIsEditing(!isEditing);

  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar
        src={profileData.profilePicture}
        canEdit={canEdit}
        // isEditing={isEditing}
      />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={profileData.username}
        isEditing={isEditing}
        onSubmit={onChangeUsername}
      />
      <div className={dashStyles.dash__2FA}>
        <ToggleSwitch
          checked={checked}
          isEditing={isEditing}
          onToggle={!!isEditing ? onToggle : undefined}
        />
        Two-Factor Authentication
      </div>
      {!!canEdit && (
        <Button initialName="Edit" onClickName="Save" onClick={onClick} />
      )}
    </div>
  );
}

export default ProfileCard;
