import { Socket } from "socket.io-client";

export interface ISocketContext {
  socket: Socket | null;
  connected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}
