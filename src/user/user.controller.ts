import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { EnableNonApprovedUser } from 'src/decorators/enable-nonapproved-user.decorator';
import { FindUserDto } from 'src/dtos/requests/find-user.request.dto';
import {
  UserDto,
  UserProtectedDto,
} from 'src/dtos/responses/user.response.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Transform } from 'src/interceptors/transform.interceptor';
import { UserService } from './user.service';

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
