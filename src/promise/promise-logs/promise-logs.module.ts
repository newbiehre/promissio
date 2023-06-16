import { Module } from '@nestjs/common';
import { PromiseLogsService } from './promise-logs.service';
import { PromiseLogsController } from './promise-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromiseLog } from 'src/entities/promise-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromiseLog])],
  controllers: [PromiseLogsController],
  providers: [PromiseLogsService],
})
export class PromiseLogsModule {}
