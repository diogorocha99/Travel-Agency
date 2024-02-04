import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { AirportsModule } from './airports/airports.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsModule } from './tickets/tickets.module';
import { PurchasesModule } from './purchases/purchases.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TicketsresellModule } from './ticketsresell/ticketsresell.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(''),
    FlightsModule, AirportsModule, CompaniesModule, TicketsModule, PurchasesModule, FavoritesModule, TicketsresellModule, RatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
