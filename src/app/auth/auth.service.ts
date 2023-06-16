import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { User } from '../user/user.entity';
import { SigninDto, SignupDto } from '../user/user.request.dto';
import { UserService } from '../user/user.service';

const scrypt = promisify(_scrypt);

export interface CurrentUserJwt {
  sub: string;
  isAdmin: boolean;
  isApproved: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async generateJwtToken(user: User) {
    const payload: CurrentUserJwt = {
      sub: user.id,
      isAdmin: user.isAdmin,
      isApproved: user.isApproved,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup({ email, firstName, lastName, password }: SignupDto) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser)
      throw new BadRequestException('User exists with email: ' + email);

    // hash pw
    const salt: string = randomBytes(8).toString('hex'); // randomBytes= raw binary (1 & 0)s; 8= 8 bytes of data which turns to 2 char when turned into hex; 16 char long string
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32= gives 32 chars as output of scrypt
    const hashedPassword = salt + '.' + hash.toString('hex');

    // create new user & save it
    const user = await this.userService.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    return this.generateJwtToken(user);
  }

  async signin({ email, password }: SigninDto) {
    const existingUser = await this.userService.findByEmail(email);

    const [salt, storedHash] = existingUser.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Bad password');

    return this.generateJwtToken(existingUser);
  }
}
