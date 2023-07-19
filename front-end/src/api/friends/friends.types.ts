import { Status } from '@/api/user/user.types';

export interface IUserDataSummary {
  id: number;
  username: string;
  profilePicture: string;
  elo: number;
  status: Status;
}

export interface IUserFriends {
  friends: IUserDataSummary[];
  nonFriends: IUserDataSummary[];
}

export interface UpdateFriendsList {
  operation: 'ADD' | 'REMOVE';
  friendId: number;
}
