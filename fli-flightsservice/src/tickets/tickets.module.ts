import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './entities/ticket.entity';
import { PurchaseSchema } from 'src/purchases/entities/purchase.entity';
import { TokenService } from 'src/token.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { FlightsService } from 'src/flights/flights.service';
import { CompaniesService } from 'src/companies/companies.service';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { CompanySchema } from 'src/companies/entities/company.entity';
import { EmailService } from 'src/email.service';
import { NotificationsService } from 'src/notifications.service';


@Module({

  imports: [
    MongooseModule.forFeature([ 
      { name: 'Ticket', schema: TicketSchema },
      { name: 'Flight', schema: FlightSchema },
      { name: 'Company', schema: CompanySchema },
      { name: 'Purchase', schema: PurchaseSchema },
    ]),
  ],

  controllers: [TicketsController],
  providers: [TicketsService, FlightsService , CompaniesService, PurchasesService, FlightsService, CompaniesService, TokenService, EmailService, NotificationsService]
})
export class TicketsModule {}
