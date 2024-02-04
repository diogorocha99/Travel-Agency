import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FlightSchema } from './entities/flight.entity';
import { TokenService } from 'src/token.service';
import { NotificationsService } from 'src/notifications.service';

@Module({

  imports: [ 
    MongooseModule.forFeature([{ name: 'Flight', schema: FlightSchema}]),
  ],

  controllers: [FlightsController],
  providers: [FlightsService, TokenService, NotificationsService]
})
export class FlightsModule {}
