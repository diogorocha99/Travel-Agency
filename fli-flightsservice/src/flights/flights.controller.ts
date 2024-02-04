import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  // @Post()
  // create(@Body() createFlightDto: CreateFlightDto) {
  //   return this.flightsService.create(createFlightDto);
  // }

  // @Get()
  // findAll() {
  //   return this.flightsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.flightsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
  //   return this.flightsService.update(+id, updateFlightDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.flightsService.remove(+id);
  // }

  @Post('/AddFlight')
  async createFlight(@Headers('token') token: string, @Body() createFlightDto: CreateFlightDto) {
    const createdFlight = await this.flightsService.createFlight(token, createFlightDto);
    return createdFlight;
  }

  @Get('date/:date')
  async getFlightsByDate(@Headers('token') token: string, @Param('date') date: string, @Headers('airportCode') airportCode: string) {
    const flights = await this.flightsService.getFlightsByDate(token, date, airportCode);
    return flights;
  }


  @Get('flights/date/:date')
  async getFlightsByDateAndAirports(
  @Param('date') date: string,
  @Headers('departureAirportCode') departureAirportCode: string,
  @Headers('arrivalAirportCode') arrivalAirportCode: string
  ) {
  const flights = await this.flightsService.getFlightsByDateAndAirports(date, departureAirportCode, arrivalAirportCode);
  return flights;
  }

  @Get('roundtrip')
  async getRoundtripFlights(
  @Headers('token') token: string,
  @Body() request: {
    departureAirport: string;
    arrivalAirport: string;
    departureDate: string;
    returnDate: string;
    }
    ): Promise<any> {
    const { departureAirport, arrivalAirport, departureDate, returnDate } = request;

    const roundtripFlights = await this.flightsService.getRoundtripFlights(
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate
    );

    return roundtripFlights;
  }

  @Get('/lowest-price')
  async getLowestPriceFlight(
    @Headers('token') token: string,
    @Headers('departureAirportCode') departureAirportCode: string,
    @Headers('arrivalAirportCode') arrivalAirportCode: string,
  ) {
    const lowestPrice = await this.flightsService.getLowestPriceFlightByAirports(token,
      departureAirportCode,
      arrivalAirportCode,
    );
    return { lowestPrice };
  }

  @Get('/Count')
  async countFlights() {
    try {
      const count = await this.flightsService.countFlights();
      return count;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('/CountByAirport')
  async getNumberOfFlightsByArrivalAirport() {
    const numberOfFlights = await this.flightsService.getNumberOfFlightsByArrivalAirport();
    return numberOfFlights;
  }

}
