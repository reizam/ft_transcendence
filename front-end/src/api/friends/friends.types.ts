export interface IUserDataSummary {
  id: number;
  username: string;
  profilePicture: string;
  elo: number;
  status: 'Online' | 'Offline' | 'In-Game';
}

export interface IUserFriends {
  friends: IUserDataSummary[];
  nonFriends: IUserDataSummary[];
}

export interface UpdateFriendsList {
  operation: 'ADD' | 'REMOVE';
  friendId: number;
}
