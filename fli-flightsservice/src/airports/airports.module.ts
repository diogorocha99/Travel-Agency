import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { AirportSchema } from './entities/airport.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/token.service';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { FlightsService } from 'src/flights/flights.service';
import { NotificationsService } from 'src/notifications.service';


@Module({

  imports: [ 
    MongooseModule.forFeature([{ name: 'Airport', schema: AirportSchema}, { name: 'Flight', schema: FlightSchema },
  ]), ],

  controllers: [AirportsController],
  providers: [AirportsService, TokenService, FlightsService, NotificationsService]
})
export class AirportsModule {}
