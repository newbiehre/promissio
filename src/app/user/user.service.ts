import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserService } from '../utils/base-user.service';
import { User } from './user.entity';
import { SignupDto, UpdateUserDto } from './user.request.dto';

@Injectable()
export class UserService extends BaseUserService {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  createUser(body: SignupDto): Promise<User> {
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
    if (oldPassword && newPassword) {
      await this.validatePassword(oldPassword, existingUser);
      const hashedPassword = await this.hashPassword(newPassword);
      const existingUserToUpdate = {
        ...existingUser,
        ...body,
        password: hashedPassword,
      };
      return this.userRepository.save(existingUserToUpdate);
    } else {
      const existingUserToUpdate = {
        ...existingUser,
        ...body,
      };
      return this.userRepository.save(existingUserToUpdate);
    }
  }
}
