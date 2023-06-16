import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto, UpdateUserDto } from './user.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // all
  findById(currentUserId: string): Promise<User> {
    return this.userRepository.findOneBy({ id: currentUserId });
  }

  // auth service
  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
  create(body: SignupDto): Promise<User> {
    const newUser = this.userRepository.create(body);
    return this.userRepository.save(newUser);
  }

  // user service
  findAllApprovedUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        isApproved: true,
      },
    });
  }

  // + promise service
  async findApprovedByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
      isApproved: true,
    });
    if (!user) throw new NotFoundException('No user by email: ' + email);
    return user;
  }

  update(body: UpdateUserDto, currentId: string) {
    return this.userRepository.update({ id: currentId }, { ...body });
  }
}
