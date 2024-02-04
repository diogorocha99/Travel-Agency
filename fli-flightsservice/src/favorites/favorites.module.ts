import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AirportSchema } from 'src/airports/entities/airport.entity';
import { FavoriteSchema } from './entities/favorite.entity';
import { AirportsService } from 'src/airports/airports.service';
import { TokenService } from 'src/token.service';
import { FlightSchema } from 'src/flights/entities/flight.entity';
import { FlightsService } from 'src/flights/flights.service';
import { NotificationsService } from 'src/notifications.service';

@Module({

  imports: [
    MongooseModule.forFeature([ 
      {name: 'Favorite', schema: FavoriteSchema },
      { name: 'Airport', schema: AirportSchema },
      { name: 'Flight', schema: FlightSchema },
    ]),
  ],

  controllers: [FavoritesController],
  providers: [FavoritesService, AirportsService, TokenService, FlightsService, NotificationsService ]
})
export class FavoritesModule {}
