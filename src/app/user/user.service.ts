import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto, UpdateUserDto } from './user.request.dto';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // all
  async findById(currentUserId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: currentUserId });
    if (!user) throw new NotFoundException('No user by id: ' + currentUserId);
    return user;
  }

  // auth service
  async findByEmail(email: string): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (!existingUser)
      throw new NotFoundException('No user by email: ' + email);
    return existingUser;
  }

  async create({ email, password, ...body }: SignupDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email,
    });
    if (existingUser)
      throw new ConflictException('Email already exists: ' + email);

    const hashedPassword = await this.hashPassword(password);
    const newUser = this.userRepository.create({
      ...body,
      email,
      password: hashedPassword,
    });
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

  async update(
    { oldPassword, newPassword, ...body }: UpdateUserDto,
    currentUserId: string,
  ) {
    const existingUser = await this.userRepository.findOneBy({
      id: currentUserId,
    });
    if (!existingUser)
      throw new NotFoundException('No user by id: ' + currentUserId);

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

  async hashPassword(password: string): Promise<string> {
    const salt: string = randomBytes(8).toString('hex'); // randomBytes= raw binary (1 & 0)s; 8= 8 bytes of data which turns to 2 char when turned into hex; 16 char long string
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32= gives 32 chars as output of scrypt
    const hashedPassword = salt + '.' + hash.toString('hex');
    return hashedPassword;
  }

  async validatePassword(password: string, existingUser: User) {
    const [salt, storedHash] = existingUser.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Bad password');
  }
}
