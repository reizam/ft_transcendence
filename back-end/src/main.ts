import { AppModule } from '@/app.module';
import { JwtSocket } from '@/sockets/jwt-socket.adapter';
import { NestFactory } from '@nestjs/core';
import { AuthService } from '@/auth/auth.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new JwtSocket(app, app.get(AuthService)));
  app.enableCors({
    origin: 'http://localhost:4000',
    methods: 'GET, POST',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.log('Error while launching the app:', error);
});
