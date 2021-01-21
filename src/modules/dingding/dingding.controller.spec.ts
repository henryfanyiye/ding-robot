import { Test, TestingModule } from '@nestjs/testing';
import { DingdingController } from './dingding.controller';

describe('DingdingController', () => {
  let controller: DingdingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DingdingController],
    }).compile();

    controller = module.get<DingdingController>(DingdingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
