import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/app/admins/admin.guard';
import { PromiseLogsService } from './promise-logs.service';

@Controller('promise-logs')
export class PromiseLogsController {
  constructor(private readonly logService: PromiseLogsService) {}

  @UseGuards(AdminGuard)
  @Get()
  getAllLogs() {
    return this.logService;
  }
}
