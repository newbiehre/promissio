import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAdminProtectedDto } from 'src/dtos/responses/user.response.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Transform } from 'src/interceptors/transform.interceptor';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Transform(UserAdminProtectedDto)
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Transform(UserAdminProtectedDto)
  @Get()
  getAllAdmins() {
    return this.adminService.getAllUsersByAdminAndApproval(true);
  }

  @Transform(UserAdminProtectedDto)
  @Get(':id')
  getAdminById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminById(id);
  }

  @Transform(UserAdminProtectedDto)
  @Get('users/isApproved/:isApproved')
  getAllUsersByApproval(
    @Param('isApproved', ParseBoolPipe) isApproved: boolean,
  ) {
    return this.adminService.getAllUsersByAdminAndApproval(false, isApproved);
  }

  @Transform(UserAdminProtectedDto)
  @Post('user/:id/approve/:approve')
  approveNewUserCreation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('approve', ParseBoolPipe) approve: boolean,
  ) {
    return this.adminService.approveNewUserCreation(id, approve);
  }

  @Transform(UserAdminProtectedDto)
  @Post('user/:id/makeAdmin/:makeAdmin')
  makeUserAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('makeAdmin', ParseBoolPipe) makeAdmin: boolean,
  ) {
    return this.adminService.makeUserAdmin(id, makeAdmin);
  }
}
