import { Test, TestingModule } from '@nestjs/testing';
import { PromiseController } from './promise.controller';

describe('PromiseController', () => {
  let controller: PromiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromiseController],
    }).compile();

    controller = module.get<PromiseController>(PromiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
