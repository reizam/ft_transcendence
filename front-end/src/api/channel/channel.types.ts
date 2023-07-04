export interface IChatUser {
  id: number;
  username: string;
  profilePicture: string;
  isAdmin: boolean;
  isMute: boolean;
  isBan: boolean;
  isBlock: boolean;
}

export interface IChannel {
  id: number;
  isPrivate: boolean;
  password: string | null;
  owner: IChatUser;
  ownerId: number;
  users: IChannelUser[];
  createdAt: Date;
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
  admins?: number[];
}

export interface IChannelPostParams {
  users: number[];
  password?: string;
  isPrivate: boolean;
}
