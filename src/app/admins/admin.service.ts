import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/user.request.dto';
import { BaseUserService } from '../utils/base-user.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserEmitterType, UserEvent } from '../users/user.event';

@Injectable()
export class AdminService extends BaseUserService {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    readonly eventEmitter: EventEmitter2,
  ) {
    super(userRepository, eventEmitter);
  }

  createAdmin(body: CreateUserDto): Promise<User> {
    return this.create(body);
  }

  getAll(isAdmin?: boolean, isApproved?: boolean): Promise<User[]> {
    return this.userRepository.findBy({
      isAdmin,
      isApproved,
    });
  }

  async getAdminById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
      isAdmin: true,
    });
    if (!user) throw new NotFoundException('No admin with id: ' + id);
    return user;
  }

  async approveUserCreation(id: string, approve: boolean): Promise<User> {
    const user: User = await this.findExistingById(id);
    if (user.isApproved === approve) return user;
    user.isApproved = approve;
    const approvedUser = await this.userRepository.save(user);

    this.emitEvent(UserEmitterType.APPROVE_BY_ADMIN, approvedUser);
    return approvedUser;
  }

  async makeAdmin(id: string, makeAdmin: boolean): Promise<User> {
    const user: User = await this.findExistingById(id);
    if (user.isAdmin === makeAdmin) return user;
    user.isAdmin = makeAdmin;
    return this.userRepository.save(user);
  }

  @OnEvent(`user.${UserEmitterType.APPROVE_BY_ADMIN}`)
  handleApproveUserEvent(payload: UserEvent) {
    // send email
    console.log(payload);
  }
}
