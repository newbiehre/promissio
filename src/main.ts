import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // moved to app module
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     forbidUnknownValues: true,
  //     whitelist: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  await app.listen(3000);
}
bootstrap();
