import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './entities/rating.entity';
import { TokenService } from 'src/token.service';
import { AirportSchema } from 'src/airports/entities/airport.entity';
import { AirportsService } from 'src/airports/airports.service';
import { FlightsService } from 'src/flights/flights.service';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { NotificationsService } from 'src/notifications.service';


@Module({

  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
    MongooseModule.forFeature([{ name: 'Airport', schema: AirportSchema}]),
    MongooseModule.forFeature([{ name: 'Flight', schema: FlightSchema }]),
  ],

  controllers: [RatingController],
  providers: [RatingService, AirportsService, TokenService, FlightsService, NotificationsService]
})
export class RatingModule {}
