import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { JwtSocket } from '@/socket/jwt-socket.adapter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  const authService = app.get(AuthService);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await authService.updateOfflineUsers();
  app.useWebSocketAdapter(new JwtSocket(app, app.get(AuthService)));
  app.use(json({ limit: '5mb' }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://46.101.112.29:4000',
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
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
  console.error('Error while launching the app:', error);
});
