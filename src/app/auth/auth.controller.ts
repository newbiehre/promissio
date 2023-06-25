import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { LoginDto, SignupDto, UserLoggerDto } from '../users/user.request.dto';
import { Public } from '../utils/public.decorator';
import { AuthResponse, AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() userDto: SignupDto): Promise<void> {
    this.log('signing up', userDto);
    return this.authService.signup(userDto);
  }

  @Post('login')
  login(@Body() userDto: LoginDto): Promise<AuthResponse> {
    this.log('logging in', userDto);
    return this.authService.login(userDto);
  }

  private log(action: string, dto: any) {
    this.logger.verbose(
      `User ${action}. Data: ${JSON.stringify(new UserLoggerDto(dto))}`,
    );
  }
}
