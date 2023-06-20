import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { SigninDto, SignupDto } from '../user/user.request.dto';
import { UserService } from '../user/user.service';

export interface CurrentUserJwt {
  sub: string;
  isAdmin: boolean;
  isApproved: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    const user = await this.userService.create(body);
    return this.generateJwtToken(user);
  }

  async signin({ email, password }: SigninDto) {
    const existingUser = await this.userService.findExistingByEmail(email);
    this.userService.validatePassword(password, existingUser);
    return this.generateJwtToken(existingUser);
  }
}
