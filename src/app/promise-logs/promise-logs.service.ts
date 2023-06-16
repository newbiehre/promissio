import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromiseLog } from './promise-log.entity';
import { User } from '../user/user.entity';
import { CreatePromiseLogDto } from './promise-log.request.dto';

@Injectable()
export class PromiseLogsService {
  constructor(
    @InjectRepository(PromiseLog)
    private readonly logRepository: Repository<PromiseLog>,
  ) {}

  getAllLogs() {
    return this.logRepository.find();
  }

  getAllLogsByPromiseId(promiseId: string) {}

  getAllLogsByCurrentUserId(currentUser: User) {
    return this.logRepository
      .createQueryBuilder('promise-log')
      .leftJoinAndSelect('promise-log.promise', 'promise')
      .where('(promise.to = :user OR promise.from = :user)', {
        user: currentUser,
      });
  }

  createAndSaveLog(log: CreatePromiseLogDto) {
    const newLog = this.logRepository.create(log);
    return this.logRepository.save(newLog);
  }
}
