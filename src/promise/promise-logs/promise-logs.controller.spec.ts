import { Test, TestingModule } from '@nestjs/testing';
import { PromiseLogsController } from './promise-logs.controller';

describe('PromiseLogsController', () => {
  let controller: PromiseLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromiseLogsController],
    }).compile();

    controller = module.get<PromiseLogsController>(PromiseLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
