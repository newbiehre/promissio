import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PromiseLog } from './entities/promise-log.entity';
import { Promise } from './entities/promise.entity';
import { User } from './entities/user.entity';
import { PromiseLogsModule } from './promise/promise-logs/promise-logs.module';
import { PromiseModule } from './promise/promise.module';
import { AdminModule } from './user/admin/admin.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

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
