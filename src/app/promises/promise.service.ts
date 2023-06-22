import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promise, PromiseStatus } from 'src/app/promises/promise.entity';
import {
  CreatePromiseDto,
  FilterPromiseDto,
} from 'src/app/promises/promise.request.dto';
import { Repository } from 'typeorm';
import { PromiseLogsService } from '../promise-logs/promise-logs.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class PromiseService {
  constructor(
    @InjectRepository(Promise)
    private readonly promiseRepository: Repository<Promise>,
    private readonly userService: UserService,
    private readonly promiseLogService: PromiseLogsService,
  ) {}

  private queryMyPromises(currentUserId: string) {
    return this.promiseRepository
      .createQueryBuilder('promise')
      .leftJoinAndSelect('promise.to', 'to')
      .leftJoinAndSelect('promise.from', 'from')
      .where('to.id = :id OR from.id = :id', { id: currentUserId });
  }

  getMyPromises(filterDto: FilterPromiseDto, currentUserId: string) {
    const { id, toUserId, fromUserId, title, ocassion, status } = filterDto;
    const query = this.queryMyPromises(currentUserId);

    id && query.andWhere('promise.id = :id', { id });
    toUserId && query.andWhere('to.id = :id', { id: toUserId });
    fromUserId && query.andWhere('from.id = :id', { id: fromUserId });
    title &&
      query.andWhere('promise.title like :title', { title: `%${title}%` });
    ocassion &&
      query.andWhere('promise.ocassion like :ocassion', {
        ocassion: `%${ocassion}%`,
      });
    status && query.andWhere('promise.status = :status', { status });

    return query.getMany();
  }

  async getMyPromiseById(id: string, currentUserId: string) {
    const promise: Promise | null = await this.queryMyPromises(currentUserId)
      .andWhere('promise.id = :id', { id })
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
    const savedPromise = await this.promiseRepository.save(newPromise);
    await this.promiseLogService.createAndSaveLog({
      promise: savedPromise,
      status: savedPromise.status,
      executedBy: currentUser,
      createdAt: savedPromise.createdAt,
    });
    return savedPromise;
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
