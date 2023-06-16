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
import { CurrentUser } from '../user/current-user.decorator';
import { User } from '../user/user.entity';
import { Transform } from '../utils/transform.interceptor';

@Controller('promise')
export class PromiseController {
  constructor(private readonly promiseService: PromiseService) {}

  @UseGuards(AdminGuard)
  @Get('admin')
  getAllPromises() {
    return this.promiseService.getAllPromises();
  }

  @Transform(PromiseDto)
  @Get()
  getMyPromises(@CurrentUser() currentUser: User) {
    return this.promiseService.getMyPromises(currentUser.id);
  }

  @Transform(PromiseDto)
  @Get(':id')
  getMyPromiseById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.getMyPromiseById(id, currentUser.id);
  } // fix later

  @Transform(PromiseDto)
  @Post()
  create(@Body() body: CreatePromiseDto, @CurrentUser() currentUser: User) {
    return this.promiseService.create(body, currentUser);
  }

  @Transform(PromiseDto)
  @Put(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePromiseDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.updateStatus(id, body.status, currentUser);
  }
}
