import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateJwtToken(user: User) {
    this.logger.verbose(`Generating Jwt Token for userId: ${user.id}`);
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
    this.logger.verbose(`New user created with userId: ${user.id}`);
    return this.generateJwtToken(user);
  }

  async signin({ email, password }: SigninDto) {
    const existingUser = await this.userService.findExistingByEmail(email);
    this.userService.validatePassword(password, existingUser);
    this.logger.verbose(`Validated user with userId: ${existingUser.id}`);
    return this.generateJwtToken(existingUser);
  }
}
