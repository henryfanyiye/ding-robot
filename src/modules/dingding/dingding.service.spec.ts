import { Test, TestingModule } from '@nestjs/testing';
import { DingdingService } from './dingding.service';

describe('DingdingService', () => {
  let service: DingdingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DingdingService],
    }).compile();

    service = module.get<DingdingService>(DingdingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
