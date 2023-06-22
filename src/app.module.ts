import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './app/admins/admin.module';
import { AuthModule } from './app/auth/auth.module';
import { PromiseLog } from './app/promise-logs/promise-log.entity';
import { PromiseLogsModule } from './app/promise-logs/promise-logs.module';
import { Promise } from './app/promises/promise.entity';
import { PromiseModule } from './app/promises/promise.module';
import { User } from './app/users/user.entity';
import { UserModule } from './app/users/user.module';
import { HttpExceptionFilter } from './app/utils/http-exception.filters';
import { HttpLoggingMiddleware } from './app/utils/logging-middleware';
import { TypeOrmExceptionFilter } from './app/utils/typeorm-exception.filters';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    AdminModule,
    PromiseModule,
    PromiseLogsModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Promise, PromiseLog],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
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
