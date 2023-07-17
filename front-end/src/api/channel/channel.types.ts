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
  mutedUntil?: Date | null;
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

export interface IMessagePost {
  channelId: number;
  message: string;
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
  PROMOTE = 'promote',
  DEMOTE = 'demote',
}

export interface IChannelUpdateParams {
  sanction: Sanction;
  userId: number;
  channelId: number;
  minutesToMute?: number;
}

export interface IChannelJoinParams {
  channelId: number;
  password?: string;
  invitedId?: number;
}
