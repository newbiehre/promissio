import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promise, PromiseStatus } from 'src/entities/promise.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { PromiseLogsService } from './promise-logs/promise-logs.service';
import { CreatePromiseDto } from 'src/dtos/requests/promise.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PromiseService {
  constructor(
    @InjectRepository(Promise)
    private readonly promiseRepository: Repository<Promise>,
    private readonly userService: UserService,
    private readonly promiseLogService: PromiseLogsService,
  ) {}

  getAllPromises() {
    return this.promiseRepository.find();
  }

  getMyPromises(currentUserId: string) {
    return this.promiseRepository
      .createQueryBuilder('promise')
      .leftJoinAndSelect('promise.to', 'to')
      .leftJoinAndSelect('promise.from', 'from')
      .where('to.id = :id OR from.id = :id', { id: currentUserId })
      .getMany();
  }

  async getMyPromiseById(id: string, currentUserId: string) {
    const promise: Promise | null = await this.promiseRepository
      .createQueryBuilder('promise')
      .leftJoinAndSelect('promise.to', 'to')
      .leftJoinAndSelect('promise.from', 'from')
      .where('promise.id = :id', { id })
      .andWhere('to.id = :id OR from.id = :id', { id: currentUserId })
      .getOne();

    if (!promise)
      throw new NotFoundException(
        `Promise with id ${id} not found for user with id${currentUserId}`,
      );

    return promise;
  }

  async create({ email, ...body }: CreatePromiseDto, currentUser: User) {
    const friend = await this.userService.findApprovedByEmail(email);
    const newPromise = this.promiseRepository.create({
      ...body,
      to: friend,
      from: currentUser,
    });
    const savedNewPromise = await this.promiseRepository.save(newPromise);
    await this.promiseLogService.createAndSaveLog({
      promise: savedNewPromise,
      status: savedNewPromise.status,
      executedBy: currentUser,
      createdAt: savedNewPromise.createdAt,
    });
    return savedNewPromise;
  }

  async updateStatus(
    promiseId: string,
    newStatus: PromiseStatus,
    currentUser: User,
  ) {
    const currentUserId = currentUser.id;
    const promise = await this.getMyPromiseById(promiseId, currentUserId);

    if (!this.isNewPromiseStatusValid(promise.status, newStatus))
      throw new BadRequestException(
        `Invalid status update: old(${promise.status}) vs. new(${newStatus})`,
      );

    const isUpdated = await this.promiseRepository.update(
      { id: promiseId },
      {
        status: newStatus,
        updatedAt: new Date(),
      },
    );

    if (isUpdated.affected <= 0) throw new NotImplementedException();

    const updatedPromise = await this.getMyPromiseById(
      promiseId,
      currentUserId,
    );

    this.promiseLogService.createAndSaveLog({
      promise: updatedPromise,
      status: updatedPromise.status,
      executedBy: currentUser,
      createdAt: updatedPromise.updatedAt,
    });

    return updatedPromise;
  }

  private isNewPromiseStatusValid(
    oldStatus: PromiseStatus,
    newStatus: PromiseStatus,
  ) {
    let valid = false;

    switch (oldStatus) {
      case PromiseStatus.ISSUED: {
        valid = [
          PromiseStatus.APPROVED,
          PromiseStatus.REJECTED,
          PromiseStatus.EXPIRED,
        ].includes(newStatus);
        break;
      }
      case PromiseStatus.APPROVED: {
        valid = [PromiseStatus.REDEEMED, PromiseStatus.EXPIRED].includes(
          newStatus,
        );
        break;
      }
      case PromiseStatus.REDEEMED: {
        valid = [PromiseStatus.EXPIRED].includes(newStatus);
        break;
      }
      case PromiseStatus.REJECTED: {
        valid = [PromiseStatus.EXPIRED].includes(newStatus);
        break;
      }
      case PromiseStatus.EXPIRED: {
        valid = false;
        break;
      }
      default:
        valid = false;
        break;
    }
    return valid;
  }
}
