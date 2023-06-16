import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SigninDto } from '../dtos/signin.dto';
import { SignupDto } from 'src/dtos/signup.dto';

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

  async signup(body: SignupDto) {
    const newUser = await this.userService.create(body);
    return this.generateJwtToken(newUser);
  }

  async signin({ email, password }: SigninDto) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser?.password !== password) throw new UnauthorizedException();
    return this.generateJwtToken(existingUser);
  }
}
