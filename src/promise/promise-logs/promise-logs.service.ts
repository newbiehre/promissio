import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromiseLogDto } from 'src/dtos/promise-log.dto';
import { PromiseLog } from 'src/entities/promise-log.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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
