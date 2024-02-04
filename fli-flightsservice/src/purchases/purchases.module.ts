import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseSchema } from './entities/purchase.entity';
import { TicketSchema } from 'src/tickets/entities/ticket.entity';
import { CompanySchema } from 'src/companies/entities/company.entity';
import { TicketsService } from 'src/tickets/tickets.service';
import { CompaniesService } from 'src/companies/companies.service';
import { TokenService } from 'src/token.service';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { FlightsService } from 'src/flights/flights.service';
import { EmailService } from 'src/email.service';
import { NotificationsService } from 'src/notifications.service';

@Module({

  imports: [ 
    MongooseModule.forFeature([
      { name: 'Purchase', schema: PurchaseSchema},
      { name: 'Ticket', schema: TicketSchema },
      { name: 'Company', schema: CompanySchema },
      { name: 'Flight', schema: FlightSchema },
    
    ]),
  ],

  controllers: [PurchasesController],
  providers: [PurchasesService, TicketsService , CompaniesService, TokenService, FlightsService, EmailService, NotificationsService]
})
export class PurchasesModule {}
