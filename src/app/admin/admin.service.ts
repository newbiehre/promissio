import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getAllUsersByAdminAndApproval(
    isAdmin: boolean,
    isApproved?: boolean,
  ): Promise<User[]> {
    return this.userRepository.find({
      where: {
        isApproved,
        isAdmin,
      },
    });
  }

  async getAdminById(id: string): Promise<User | null> {
    const result = await this.userRepository.findOneBy({
      isAdmin: true,
      id,
    });
    if (!result) throw new NotFoundException('No admins with user id: ' + id);
    return result;
  }

  async approveNewUserCreation(id: string, approve: boolean): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('Cannot find user: ' + id);
    if (user.isApproved === approve) return user;

    user.isApproved = approve;
    return this.userRepository.save(user);
  }

  async makeUserAdmin(id: string, makeAdmin: boolean): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      isApproved: true,
      id,
    });

    if (!user)
      throw new NotFoundException(
        'Cannot find user or new user has not been approved: ' + id,
      );

    if (user.isAdmin === makeAdmin) return user;

    user.isAdmin = makeAdmin;
    return this.userRepository.save(user);
  }
}
