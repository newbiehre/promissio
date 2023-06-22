import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromiseLog } from '../promise-logs/promise-log.entity';
import { PromiseController } from './promise.controller';
import { PromiseService } from './promise.service';
import { PromiseLogsController } from '../promise-logs/promise-logs.controller';
import { PromiseLogsService } from '../promise-logs/promise-logs.service';
import { PromiseLogsModule } from '../promise-logs/promise-logs.module';
import { Promise } from 'src/app/promises/promise.entity';
import { UserModule } from '../users/user.module';

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
