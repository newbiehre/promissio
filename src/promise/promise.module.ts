import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromiseLog } from '../entities/promise-log.entity';
import { PromiseController } from './promise.controller';
import { PromiseService } from './promise.service';
import { UserModule } from 'src/user/user.module';
import { PromiseLogsController } from './promise-logs/promise-logs.controller';
import { PromiseLogsService } from './promise-logs/promise-logs.service';
import { PromiseLogsModule } from './promise-logs/promise-logs.module';
import { Promise } from 'src/entities/promise.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Promise, PromiseLog]),
    PromiseLogsModule,
  ],
  providers: [PromiseService, PromiseLogsService],
  controllers: [PromiseController, PromiseLogsController],
})
export class PromiseModule {}
