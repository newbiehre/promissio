import { Test, TestingModule } from '@nestjs/testing';
import { PromiseService } from './promise.service';

describe('PromiseService', () => {
  let service: PromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromiseService],
    }).compile();

    service = module.get<PromiseService>(PromiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
