export interface IUserData {
  fortytwoId: number;
  username: string;
  firstName: string;
  lastName: string;
  has2FA: boolean;
  profilePicture: string;
}

export type UpdateProfile = Partial<
  Pick<IUserData, 'username' | 'has2FA' | 'profilePicture'>
>;
