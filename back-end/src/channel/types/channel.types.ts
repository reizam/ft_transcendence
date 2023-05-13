export interface IChannel {
  id: number;
  private: boolean;
  owner: string;
  admins: string[];
  users: string[];
  password: string | null;
  createdAt: Date;
}
