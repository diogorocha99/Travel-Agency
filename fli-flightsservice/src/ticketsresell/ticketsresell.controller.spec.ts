import { Test, TestingModule } from '@nestjs/testing';
import { TicketsresellController } from './ticketsresell.controller';
import { TicketsresellService } from './ticketsresell.service';

describe('TicketsresellController', () => {
  let controller: TicketsresellController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsresellController],
      providers: [TicketsresellService],
    }).compile();

    controller = module.get<TicketsresellController>(TicketsresellController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
