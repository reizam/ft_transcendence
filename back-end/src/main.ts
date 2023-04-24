import { AppModule } from '@/app.module';
import { JwtSocket } from '@/sockets/jwt-socket.adapter';
import { NestFactory } from '@nestjs/core';
import { AuthService } from '@/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new JwtSocket(app, app.get(AuthService)));

  await app.listen(3000);
}

bootstrap();
