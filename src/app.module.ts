import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './app/admin/admin.module';
import { AuthModule } from './app/auth/auth.module';
import { PromiseLogsModule } from './app/promise-logs/promise-logs.module';
import { PromiseModule } from './app/promise/promise.module';
import { UserModule } from './app/user/user.module';
import { User } from './app/user/user.entity';
import { Promise } from './app/promise/promise.entity';
import { PromiseLog } from './app/promise-logs/promise-log.entity';
import configuration from './config/configuration';

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
})
export class AppModule {}
