import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { EnableNonApprovedUser } from './enable-nonapproved-user.decorator';
import { UserDto, UserProtectedDto } from './user.response.dto';
import { Transform } from '../utils/transform.interceptor';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';
import { FindUserDto, UpdateUserDto } from './user.request.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @EnableNonApprovedUser()
  @Transform(UserProtectedDto)
  @Get('self')
  getSelf(@CurrentUser() currentUser: User) {
    return this.userService.findById(currentUser.id);
  }

  @Transform(UserProtectedDto)
  @Put('self')
  @HttpCode(204)
  update(@Body() body: UpdateUserDto, @CurrentUser() currentUser: User) {
    return this.userService.update(body, currentUser.id);
  }

  @Transform(UserDto)
  @Get()
  getAllUsers() {
    return this.userService.findAllApprovedUsers();
  }

  @Transform(UserDto)
  @Get('by-email')
  getUserById(@Body() body: FindUserDto) {
    return this.userService.findApprovedByEmail(body.email);
  }
}
