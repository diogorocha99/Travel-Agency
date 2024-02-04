import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // @Post()
  // create(@Body() createTicketDto: CreateTicketDto) {
  //   return this.ticketsService.create(createTicketDto);
  // }

  // @Get()
  // findAll() {
  //   return this.ticketsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ticketsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
  //   return this.ticketsService.update(+id, updateTicketDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ticketsService.remove(+id);
  // }

  @Post('buyroundtrip')
  async buyRoundTripTicket(
    @Headers('token') token: string,
    @Body('departureFlightId') departureFlightId: string,
    @Body('returnFlightId') returnFlightId: string,
    @Body('bagsCount') bagsCount: number,
    @Body('className') className: string,
  ): Promise<Ticket[]> {
    const tickets = await this.ticketsService.buyRoundTripTicket(
      token,
      departureFlightId,
      returnFlightId,
      bagsCount,
      className,
    );
    return tickets;
  }

  @Get('/user')
  async getTicketsByUser(@Headers('token') token: string,): Promise<any> {
  
    const tickets = await this.ticketsService.getTicketsByUser(token);
    return tickets;
  }

  @Post('/onlywayticket')
  async createOnlyWayTicket(
    @Headers('token') token: string,
    @Body('departureFlightId') departureFlightId: string,
    @Body('bagsCount') bagsCount: number,
    @Body('className') className: string,
  ) {
    const ticket = await this.ticketsService.onlywayticket(token, departureFlightId, bagsCount, className);
    return ticket;
  }


  @Put('update-status/:ticketId')
  async updateTicketStatus(@Param('ticketId') ticketId: string): Promise<void> {
    await this.ticketsService.deactivateTicket(ticketId);
  }

  @Get('/active')
  async getTicketsByUserActive(@Headers('token') token: string): Promise<any> {
  
    const tickets = await this.ticketsService.getTicketsByUserActive(token);
    return tickets;
  }

  

}


