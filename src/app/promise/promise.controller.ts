import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePromiseDto,
  UpdatePromiseDto,
} from 'src/app/promise/promise.request.dto';
import { PromiseDto } from 'src/app/promise/promise.response.dto';
import { AdminGuard } from 'src/app/admin/admin.guard';
import { PromiseService } from './promise.service';
import { PromiseStatus } from 'src/app/promise/promise.entity';
import { CurrentUser } from '../user/user-current.decorator';
import { User } from '../user/user.entity';
import { Serialize } from '../utils/serialize.interceptor';

@Controller('promise')
export class PromiseController {
  constructor(private readonly promiseService: PromiseService) {}

  @UseGuards(AdminGuard)
  @Get('admin')
  getAllPromises() {
    return this.promiseService.getAllPromises();
  }

  @Serialize(PromiseDto)
  @Get()
  getMyPromises(@CurrentUser() currentUser: User) {
    return this.promiseService.getMyPromises(currentUser.id);
  }

  @Serialize(PromiseDto)
  @Get(':id')
  getMyPromiseById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.getMyPromiseById(id, currentUser.id);
  } // fix later

  @Serialize(PromiseDto)
  @Post()
  create(@Body() body: CreatePromiseDto, @CurrentUser() currentUser: User) {
    return this.promiseService.create(body, currentUser);
  }

  @Serialize(PromiseDto)
  @Put(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePromiseDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.updateStatus(id, body.status, currentUser);
  }
}
