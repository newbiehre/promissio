import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/app/admin/admin.guard';
import { AdminService } from './admin.service';
import { UserAdminProtectedDto } from '../user/user.response.dto';
import { Serialize } from '../utils/serialize.interceptor';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Serialize(UserAdminProtectedDto)
  @Get('users')
  getAllUsers() {
    return this.adminService.getAll();
  }

  @Serialize(UserAdminProtectedDto)
  @Get()
  getAllAdmins() {
    return this.adminService.getAll(true);
  }

  @Serialize(UserAdminProtectedDto)
  @Get(':id')
  getAdminById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminById(id);
  }

  @Serialize(UserAdminProtectedDto)
  @Get('users/isApproved/:isApproved')
  getAllUsersByApproval(
    @Param('isApproved', ParseBoolPipe) isApproved: boolean,
  ) {
    return this.adminService.getAll(false, isApproved);
  }

  @Serialize(UserAdminProtectedDto)
  @Post('user/:id/approve/:approve')
  approveNewUserCreation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('approve', ParseBoolPipe) approve: boolean,
  ) {
    return this.adminService.approveUserCreation(id, approve);
  }

  @Serialize(UserAdminProtectedDto)
  @Post('user/:id/makeAdmin/:makeAdmin')
  makeUserAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('makeAdmin', ParseBoolPipe) makeAdmin: boolean,
  ) {
    return this.adminService.makeAdmin(id, makeAdmin);
  }
}
