import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  // moved to app module; best practice to move to module esp if you have depencency
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
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port: ${port}`);
}
bootstrap();
