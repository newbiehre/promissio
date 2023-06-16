import { Test, TestingModule } from '@nestjs/testing';
import { PromiseLogsService } from './promise-logs.service';

describe('PromiseLogsService', () => {
  let service: PromiseLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromiseLogsService],
    }).compile();

    service = module.get<PromiseLogsService>(PromiseLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
