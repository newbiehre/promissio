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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import {
  CreatePromiseDto,
  UpdatePromiseDto,
} from 'src/dtos/requests/promise.dto';
import { PromiseDto } from 'src/dtos/responses/promise.response.dto';
import { User } from 'src/entities/user.entity';
import { AdminGuard } from 'src/guards/admin.guard';
import { Transform } from 'src/interceptors/transform.interceptor';
import { PromiseService } from './promise.service';
import { PromiseStatus } from 'src/entities/promise.entity';

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
