import { Injectable, UnauthorizedException, BadRequestException, NotFoundException} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flight } from './entities/flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { TokenService } from 'src/token.service';
import { isPast, parseISO } from 'date-fns';
import { NotificationsService } from 'src/notifications.service';
import axios from 'axios';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flight.name) private readonly flightModel: Model<Flight>,
    private readonly tokenService: TokenService,
    private readonly notificationsService: NotificationsService,
  ) {}


  create(createFlightDto: CreateFlightDto) {
    return 'This action adds a new flight';
  }

  findAll() {
    return `This action returns all flights`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flight`;
  }

  update(id: number, updateFlightDto: UpdateFlightDto) {
    return `This action updates a #${id} flight`;
  }

  remove(id: number) {
    return `This action removes a #${id} flight`;
  }

  async createFlight(token: string, createFlightDto: CreateFlightDto): Promise<Flight> {

    const { id, role } = this.tokenService.decodeToken(token)

    if (role != "Admin") {
      throw new UnauthorizedException("Invalid Permission")
    }

    const parsedDatedeparture = parseISO(createFlightDto.departureTime);
    const parsedDatearrival = parseISO(createFlightDto.arrivalTime);

    var lowestPrice1 = 0

    const lowestPrice = await this.getLowestPriceFlightByAirports(
    token,
    createFlightDto.departureAirport,
    createFlightDto.arrivalAirport
  );


  const flight = new this.flightModel(createFlightDto);

    // Save the flight
    await flight.save();

    // createFlightDto.classes.forEach((flightClass) => {
    //   if (lowestPrice === null || flightClass.price < lowestPrice) {
    //     lowestPrice1 = flightClass.price;
    //   }
    // });

    // if (lowestPrice1 < lowestPrice) {

    //   const response = await axios.get('http://localhost:3000/users/UserData', {
    //     headers: {
    //     token: token,
    //   },
    //   });
      
    //      const {email, name, fcmToken} = response.data;


    //   await this.notificationsService.sendNotification(
    //    fcmToken,
    //    'Flight Promotions',
    //    'The tickets for '+ createFlightDto.arrivalAirport + 'are more cheap than usual. You can consult our new flight to your desired destination by clicking in thix box',
    //    'FLIGHT_TICKET_NOTIFICATION',
    //    { link: 'http://localhost:3020/ticketsresell/mytickets' }
    //   );


    // }

  return flight;
}

  async getFlightsByDate(token: string, date: string, airportCode: string): Promise<Flight[]> {


    const { id, role } = this.tokenService.decodeToken(token);
  
    const [year, month, day] = date.split('-');

    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
  
    const flights = await this.flightModel
      .find({
        departureTime: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
        departureAirport: airportCode,
      })
      .exec();
  
    return flights;
  }


async getRoundtripFlights(departureAirportCode: string, arrivalAirportCode: string, departureDate: string, returnDate: string): Promise<any> {

  
    const [depYear, depMonth, depDay] = departureDate.split('-');
    const departureStartDate = new Date(parseInt(depYear), parseInt(depMonth) - 1, parseInt(depDay));
    const departureEndDate = new Date(departureStartDate);
    departureEndDate.setDate(departureEndDate.getDate() + 1);

    const [retYear, retMonth, retDay] = returnDate.split('-');
    const returnStartDate = new Date(parseInt(retYear), parseInt(retMonth) - 1, parseInt(retDay));
    const returnEndDate = new Date(returnStartDate);
    returnEndDate.setDate(returnEndDate.getDate() + 1);

    const departureFlights = await this.flightModel.find({
      departureAirport: departureAirportCode,
      arrivalAirport: arrivalAirportCode,
      departureTime: { $gte: departureStartDate.toISOString(), $lt: departureEndDate.toISOString() },
    }).exec();

    const returnFlights = await this.flightModel.find({
      departureAirport: arrivalAirportCode,
      arrivalAirport: departureAirportCode,
      departureTime: { $gte: returnStartDate.toISOString(), $lt: returnEndDate.toISOString() },
    }).exec();

    const roundtripView = {
      departure: departureFlights,
      return: returnFlights,
    };

    return roundtripView;
  }


  async getFlightsByDateAndAirports(date: string, departureAirportCode: string, arrivalAirportCode: string): Promise<Flight[]> {
    const [year, month, day] = date.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
  
    const flights = await this.flightModel
      .find({
        departureTime: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
        departureAirport: departureAirportCode,
        arrivalAirport: arrivalAirportCode,
      })
      .exec();
  
    return flights;
  }
  
  async getLowestPriceFlightByAirports(token: string, departureAirportCode: string, arrivalAirportCode: string) {

    const { id, role } = this.tokenService.decodeToken(token);

    try {
      const flights = await this.flightModel
        .find({
          departureAirport: departureAirportCode,
          arrivalAirport: arrivalAirportCode,
        })
        .exec();
  
      let lowestPrice = null;
  
      flights.forEach((flight) => {
        flight.classes.forEach((flightClass) => {
          if (lowestPrice === null || flightClass.price < lowestPrice) {
            lowestPrice = flightClass.price;
          }
        });
      });
  
      return lowestPrice;
    } catch (error) {
      throw new Error('Error fetching lowest price flight');
    }
  }

  async countFlights() {
    const count = await this.flightModel.count();
      console.log(count.toString())
    if (!count)
      throw new NotFoundException('Flights not found');

    return {count} ;
  }

  async getNumberOfFlightsByArrivalAirport() {
    try {
      const flightCounts = await this.flightModel.aggregate([
        { $group: { _id: '$arrivalAirport', flightCount: { $sum: 1 } } },
        {
          $project: {
            _id: 0,
            label: '$_id',
            value: '$flightCount',
          },
        },
      ]);
      return flightCounts;
    } catch (error) {
      throw new Error('Failed to count flights by airport');
    }
  }


}
