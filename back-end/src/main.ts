import { AppModule } from '@/app.module';
import { JwtSocket } from '@/sockets/jwt-socket.adapter';
import { NestFactory } from '@nestjs/core';
import { AuthService } from '@/auth/auth.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new JwtSocket(app, app.get(AuthService)));
  app.enableCors({
    origin: 'http://localhost:4000',
    methods: 'GET, POST',
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
