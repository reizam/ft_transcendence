import { AuthService } from '@/auth/auth.service';
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';

export class JwtSocket extends IoAdapter {
  private readonly authService: AuthService;

  constructor(private app: INestApplicationContext, authService: AuthService) {
    super(app);
    this.authService = authService;
  }

  createIOServer(port: number, options?: any): any {
    const corsOptions = {
      origin: process.env.FRONTEND_URL || 'http://localhost:4000',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    const server = super.createIOServer(port, {
      ...options,
      cors: corsOptions,
    });

    server.use(async (socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const user = await this.authService.validateToken(token as string);

      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.data.user = user;

      return next();
    });
    return server;
  }
}
