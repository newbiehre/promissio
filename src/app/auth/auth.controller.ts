import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SigninDto, SignupDto, UserLoggingDto } from '../user/user.request.dto';
import { Public } from '../utils/public.decorator';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() userDto: SignupDto) {
    this.logger.verbose(
      `User signing up. Data: ${JSON.stringify(new UserLoggingDto(userDto))}`,
    );
    return this.authService.signup(userDto);
  }

  @Post('signin')
  signin(@Body() userDto: SigninDto) {
    this.logger.verbose(
      `User signing in. Data: ${JSON.stringify(new UserLoggingDto(userDto))}`,
    );
    return this.authService.signin(userDto);
  }
}
