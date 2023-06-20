import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/user.request.dto';
import { BaseUserService } from '../utils/base-user.service';

@Injectable()
export class AdminService extends BaseUserService {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
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
    return this.userRepository.save(user);
  }

  async makeAdmin(id: string, makeAdmin: boolean): Promise<User> {
    const user: User = await this.findExistingById(id);
    if (user.isAdmin === makeAdmin) return user;
    user.isAdmin = makeAdmin;
    return this.userRepository.save(user);
  }
}
