import { Body, Controller, Post } from '@nestjs/common';
import { SigninDto } from 'src/dtos/signin.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { SignupDto } from 'src/dtos/signup.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
}
