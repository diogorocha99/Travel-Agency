import { Test, TestingModule } from '@nestjs/testing';
import { TicketsresellService } from './ticketsresell.service';

describe('TicketsresellService', () => {
  let service: TicketsresellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsresellService],
    }).compile();

    service = module.get<TicketsresellService>(TicketsresellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
