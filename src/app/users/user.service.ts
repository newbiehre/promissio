import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserService } from '../utils/base-user.service';
import { User } from './user.entity';
import { SignupDto, UpdateUserDto } from './user.request.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserEmitterType, UserEvent } from './user.event';

@Injectable()
export class UserService extends BaseUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    readonly eventEmitter: EventEmitter2,
  ) {
    super(userRepository, eventEmitter);
  }

  createUser(body: SignupDto): Promise<User> {
    this.logger.log('Creating user with', body);
    return this.create(body);
  }

  findAllApproved(): Promise<User[]> {
    return this.userRepository.findBy({
      isApproved: true,
    });
  }

  async findApprovedByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
      isApproved: true,
    });
    if (!user) throw new NotFoundException('No user by email: ' + email);
    return user;
  }

  async update(
    { oldPassword, newPassword, ...body }: UpdateUserDto,
    currentUserId: string,
  ) {
    const existingUser = await this.findExistingById(currentUserId);
    this.logger.log('Updating user with', body);

    const existingUserToUpdate = {
      ...existingUser,
      ...body,
    };

    let updatedUser = null;
    if (oldPassword && newPassword) {
      await this.validatePassword(oldPassword, existingUser);
      const hashedPassword = await this.hashPassword(newPassword);
      updatedUser = this.userRepository.save({
        ...existingUserToUpdate,
        password: hashedPassword,
      });
    } else {
      updatedUser = this.userRepository.save(existingUserToUpdate);
    }

    this.emitEvent(UserEmitterType.UPDATE, existingUserToUpdate);
    return updatedUser;
  }

  @OnEvent(`user.${UserEmitterType.UPDATE}`)
  handleApproveUserEvent(payload: UserEvent) {
    // send email
    console.log(payload);
  }
}
