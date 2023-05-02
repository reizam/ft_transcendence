import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { JwtSocket } from '@/sockets/jwt-socket.adapter';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useWebSocketAdapter(new JwtSocket(app, app.get(AuthService)));
  app.use(json({ limit: '5mb' }));
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
