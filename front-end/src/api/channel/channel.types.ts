export interface IChatUser {
  id: number;
  username: string;
  profilePicture: string;
}

export interface IChannel {
  id: number;
  isPrivate: boolean;
  isProtected: boolean;
  ownerId: number;
  users: IChannelUser[];
  bannedUserIds: number[];
  createdAt?: Date;
}

export interface IMessagePage {
  messages: IMessage[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  totalCount: number;
}

export interface IChannelPage {
  channels: IChannel[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  totalCount: number;
}

export interface IMessage {
  id: number;

  channelId: number;
  userId: number;
  user: any;

  message: string;
  gameId: number | null;

  own?: boolean;
}

export interface IChannelUser {
  channelId: number;
  userId: number;
  user: IChatUser;
  isAdmin: boolean;
  mutedUntil?: Date;
}

export interface IChannelPage {
  channels: IChannel[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  totalCount: number;
}

export interface IChannelSendMessagePostParams {
  message: string;
  channelId: number;
}

export interface IChannelPutParams {
  channelId: number;
  withPassword: boolean;
  password?: string;
}

export interface IChannelPostParams {
  users: number[];
  password?: string;
  isPrivate: boolean;
}

export enum Sanction {
  KICK = 'kick',
  BAN = 'ban',
  UNBAN = 'unban',
  MUTE = 'mute',
  UNMUTE = 'unmute',
}
