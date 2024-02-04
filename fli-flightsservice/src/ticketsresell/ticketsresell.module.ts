import { Module } from '@nestjs/common';
import { TicketsresellService } from './ticketsresell.service';
import { TicketsresellController } from './ticketsresell.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketResellSchema } from './entities/ticketsresell.entity';
import { TicketSchema } from 'src/tickets/entities/ticket.entity';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { CompanySchema } from 'src/companies/entities/company.entity';
import { PurchaseSchema } from 'src/purchases/entities/purchase.entity';
import { TokenService } from 'src/token.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { FlightsService } from 'src/flights/flights.service';
import { CompaniesService } from 'src/companies/companies.service';
import { EmailService } from 'src/email.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { NotificationsService } from 'src/notifications.service';


@Module({

  imports: [
    MongooseModule.forFeature([ 
      {name: 'TicketResell', schema: TicketResellSchema },
      { name: 'Ticket', schema: TicketSchema },
      { name: 'Flight', schema: FlightSchema },
      { name: 'Company', schema: CompanySchema },
      { name: 'Purchase', schema: PurchaseSchema },
    ]),
  ],

  controllers: [TicketsresellController],
  providers: [TicketsresellService, TicketsService, FlightsService , CompaniesService, PurchasesService, FlightsService, CompaniesService, TokenService, EmailService, NotificationsService]
})
export class TicketsresellModule {}
