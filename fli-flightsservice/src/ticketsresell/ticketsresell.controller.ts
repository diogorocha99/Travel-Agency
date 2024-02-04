import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { TicketsresellService } from './ticketsresell.service';
import { CreateTicketsresellDto } from './dto/create-ticketsresell.dto';
import { UpdateTicketsresellDto } from './dto/update-ticketsresell.dto';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { TicketResell } from './entities/ticketsresell.entity';

@Controller('ticketsresell')
export class TicketsresellController {
  constructor(private readonly ticketsresellService: TicketsresellService) {}

  // @Post()
  // create(@Body() createTicketsresellDto: CreateTicketsresellDto) {
  //   return this.ticketsresellService.create(createTicketsresellDto);
  // }

  // @Get()
  // findAll() {
  //   return this.ticketsresellService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ticketsresellService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsresellDto: UpdateTicketsresellDto) {
    return this.ticketsresellService.update(+id, updateTicketsresellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsresellService.remove(+id);
  }

  @Get('/mytickets')
  async getMyResellTickets(@Headers('token') token: string): Promise<{ ticket: Ticket, currentHighestBid: number, biddingEndTime: Date }[]> {
  
    return this.ticketsresellService.getMyResellTickets(token);
  }

  @Post('/accept-bid')
  async acceptBidAndFinishResell(
  @Headers('token') token: string,
  @Headers('ticketResellId') ticketResellId: string,
  @Body() body: { token: string },
  ): Promise<Ticket> {

    // Call the service method to accept the bid and finish the resell
    const originalTicket = await this.ticketsresellService.acceptBidAndFinishResell(ticketResellId, token);

    return originalTicket;
  }


  @Post('/make-offer')
  async makeOffer(
  @Headers('token') token: string,
  @Headers('ticketResellId') ticketResellId: string,
  @Headers('offerPrice') offerPrice: number ,
  ): Promise<TicketResell> {
  

    // Call the service method to make the offer
    const ticketOffer = await this.ticketsresellService.makeOffer(token, ticketResellId, offerPrice);

    return ticketOffer;
  }

  @Post('/add')
  async resellTicket(@Headers('token') token: string, @Headers('ticketId') ticketId: string, @Headers('price') price: number): Promise<TicketResell> {
    return this.ticketsresellService.resellTicket(token, ticketId, price);
  }


  @Get('/getallreselltickets')
  async getAllResellTickets(): Promise<TicketResell[]> {
    try {
      const resellTickets = await this.ticketsresellService.getAllResellTickets();
      return resellTickets.filter(ticket => !ticket.isCompleted);
    } catch (error) {
      // Handle the error appropriately
      throw error;
    }
  }

}
