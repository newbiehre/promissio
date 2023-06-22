import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { EnableNonApprovedUser } from './user-enable-nonapproved.decorator';
import { UserDto, UserProtectedDto } from './user.response.dto';
import { Serialize } from '../utils/serialize.interceptor';
import { CurrentUser } from './user-current.decorator';
import { User } from './user.entity';
import { FindUserDto, UpdateUserDto } from './user.request.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @EnableNonApprovedUser()
  @Serialize(UserProtectedDto)
  @Get('account')
  getSelf(@CurrentUser() currentUser: User) {
    return this.userService.findExistingById(currentUser.id);
  }

  @Serialize(UserProtectedDto)
  @Put('account')
  @HttpCode(204)
  update(@Body() body: UpdateUserDto, @CurrentUser() currentUser: User) {
    return this.userService.update(body, currentUser.id);
  }

  @Serialize(UserDto)
  @Get()
  getAllUsers() {
    return this.userService.findAllApproved();
  }

  @Serialize(UserDto)
  @Get('by-email')
  getUserById(@Body() body: FindUserDto) {
    return this.userService.findApprovedByEmail(body.email);
  }
}
