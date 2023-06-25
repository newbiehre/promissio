import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreatePromiseDto,
  FilterPromiseDto,
  UpdatePromiseDto,
} from 'src/app/promises/promise.request.dto';
import { PromiseDto } from 'src/app/promises/promise.response.dto';
import { CurrentUser } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../utils/serialize.interceptor';
import { PromiseService } from './promise.service';

@Controller('promise')
export class PromiseController {
  constructor(private readonly promiseService: PromiseService) {}

  @Serialize(PromiseDto)
  @Get()
  getMyPromises(
    @Query() filterDto: FilterPromiseDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.getMyPromises(filterDto, currentUser.id);
  }

  @Serialize(PromiseDto)
  @Get(':id')
  getMyPromiseById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.promiseService.getMyPromiseById(id, currentUser.id);
  }

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
