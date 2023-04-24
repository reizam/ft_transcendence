import { useState, useEffect, FC } from 'react';
import { getCookie } from 'cookies-next';
import { BACKEND_URL } from "@/constants/env";

interface ProfileCardProps {
  username: string,
  picture: string,
  twoFAIsEnabled: boolean
}


function ProfileCard() {
  return (
    <div>
      <h1>Profile Card</h1>
    </div>
  );
};

export default ProfileCard;
