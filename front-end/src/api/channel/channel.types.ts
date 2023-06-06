export interface IChannel {
  id: number;

  private: boolean;
  password: string | null;

  owner: any;
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
  user: any;

  admin: boolean;
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
  admins: number[];
}

export interface IChannelPostParams {
  users: number[];
  password?: string;
  private: boolean;
}
