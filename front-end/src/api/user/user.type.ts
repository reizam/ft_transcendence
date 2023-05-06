export interface IUserData {
  fortytwoId: number;
  username: string;
  firstName: string;
  lastName: string;
  has2FA: boolean;
  profilePicture: string;
}

export interface IUpdateProfile {
  has2FA?: boolean;
  profilePicture?: string;
  username?: string;
}
