import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  SigninDto,
  SignupDto,
  UserLoggingDto,
} from '../users/user.request.dto';
import { Public } from '../utils/public.decorator';
import { AuthResponse, AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() userDto: SignupDto): Promise<AuthResponse> {
    this.log('signing up', userDto);
    return this.authService.signup(userDto);
  }

  @Post('login')
  signin(@Body() userDto: SigninDto): Promise<AuthResponse> {
    this.log('logging in', userDto);
    return this.authService.signin(userDto);
  }

  private log(action: string, dto: any) {
    this.logger.verbose(
      `User ${action}. Data: ${JSON.stringify(new UserLoggingDto(dto))}`,
    );
  }
}
