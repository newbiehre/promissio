import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './app/admin/admin.module';
import { AuthModule } from './app/auth/auth.module';
import { PromiseLog } from './app/promise-logs/promise-log.entity';
import { PromiseLogsModule } from './app/promise-logs/promise-logs.module';
import { Promise } from './app/promise/promise.entity';
import { PromiseModule } from './app/promise/promise.module';
import { User } from './app/user/user.entity';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    PromiseModule,
    PromiseLogsModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'promissio',
      entities: [User, Promise, PromiseLog],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
