import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class UpdateFriendsList {
  @IsNotEmpty()
  @IsIn(['ADD', 'REMOVE'])
  operation: string;

  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export type UserSummary = {
  id: number;
  username: string;
  elo: number;
  profilePicture: string;
};

export type WithStatus<T> = T & { status?: 'Online' | 'Offline' | 'In-Game' };
