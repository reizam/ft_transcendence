export interface IChannel {
  id: number;

  private: boolean;
  password: string | null;

  owner: any;
  ownerId: number;

  users: IChannelUser[];

  createdAt: Date;
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
