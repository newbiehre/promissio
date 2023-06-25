import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { LoginDto, SignupDto } from '../users/user.request.dto';
import { UserService } from '../users/user.service';

export interface AuthResponse {
  access_token: string;
}

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
  }

  async login({ email, password }: LoginDto) {
    const existingUser = await this.userService.findExistingByEmail(email);
    await this.userService.validatePassword(password, existingUser);
    this.logger.verbose(`Validated user with userId: ${existingUser.id}`);
    return this.generateJwtToken(existingUser);
  }
}
