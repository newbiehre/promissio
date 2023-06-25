import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AdminModule } from './app/admins/admin.module';
import { AuthModule } from './app/auth/auth.module';
import { PromiseLogsModule } from './app/promise-logs/promise-logs.module';
import { PromiseModule } from './app/promises/promise.module';
import { UserModule } from './app/users/user.module';
import { HttpExceptionFilter } from './app/utils/http-exception.filters';
import { HttpLoggingMiddleware } from './app/utils/logging-middleware';
import { TypeOrmExceptionFilter } from './app/utils/typeorm-exception.filters';
import { DatabaseModule } from './configs/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AdminModule,
    PromiseModule,
    PromiseLogsModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidUnknownValues: true,
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
