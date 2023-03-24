import { AppModule } from '@/app.module';
import { prisma } from '@lib/prisma.lib';
import { NestFactory } from '@nestjs/core';

async function testInit() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        email: 'john.doe@gmail.com',
        name: 'John Doe',
        id: 1,
      },
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await testInit();

  await app.listen(3000);
}

bootstrap();
