import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

class CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

@Injectable()
export abstract class BaseUserService {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {}

  async findExistingById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('No user by id: ' + id);
    return user;
  }

  async findExistingByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('No user by email: ' + email);
    return user;
  }

  async findNewByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException('Duplicate email: ' + email);
    return user;
  }

  async create({
    email,
    password,
    isAdmin,
    ...body
  }: CreateUserParams): Promise<User> {
    await this.findNewByEmail(email);

    const hashedPassword = await this.hashPassword(password);
    const newUser = this.userRepository.create({
      ...body,
      email,
      password: hashedPassword,
      isAdmin,
    });
    return this.userRepository.save(newUser);
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
