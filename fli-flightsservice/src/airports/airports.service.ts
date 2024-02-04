import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Put } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import * as jwt from 'jsonwebtoken';
import { Airport, Categories} from './entities/airport.entity';
import { Model, ObjectId, Types  } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Multer } from 'multer';
import { TokenService } from '../token.service';
import { Flight } from 'src/flights/entities/flight.entity';
import { Console } from 'console';

@Injectable()
export class AirportsService {
  constructor(
    @InjectModel(Airport.name) private airportModel: Model<Airport>, 
    @InjectModel(Flight.name) private flightModel: Model<Flight>,
  private readonly tokenService: TokenService) {}


  create(createAirportDto: CreateAirportDto) {
    
    return 'This action adds a new airport';
  }

  // findAll() {
  //   return `This action returns all airports`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} airport`;
  // }

  update(id: number, updateAirportDto: UpdateAirportDto) {
    return `This action updates a #${id} airport`;
  }

  remove(id: number) {
    return `This action removes a #${id} airport`;
  }

  async createairport(Airport: CreateAirportDto, token: string) {

    const { id, role } = this.tokenService.decodeToken(token)

    if (role != "Admin") {
      throw new UnauthorizedException("Invalid Permission")
    }

    const { code, name, rating = 0, country, city, latitude, longitude, categorie, numberofreviews = 0 } = Airport;


    const airport = await this.airportModel.create({
      code,
      name,
      rating,
      country,
      city,
      latitude,
      longitude,
      categorie,
      numberofreviews,
    });

  }

  // decodeToken(token: string): { id: string; role: string } | null {
  //   try {
  //       const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
  //       const { id, role } = decodedToken;
  //         return { id: id, role: role };
  //   } catch (error) {
  //       throw new UnauthorizedException(error)
     
  //   }
  // }

  async uploadpicture(token: string, code: string, files: Express.Multer.File[]) {

    const { id, role } = this.tokenService.decodeToken(token)

    if (role != "Admin") {
      throw new UnauthorizedException("Invalid Permission")
    }


    const airportexists = await this.airportModel.findOne(({ code }))
  
    if (!airportexists) {
      throw new NotFoundException('Airport not found');
    }

    //airportexists.pictures = [...(airportexists.pictures || []), files.buffer];

    if (!files || files.length === 0) {
      throw new BadRequestException('No files were uploaded.');
    }

    // if (typeof airportexists.pictures === 'object') {
    //   airportexists.pictures.push = function(buffer) {
    //     this[this.length] = buffer;
    //     return this.length;
    //   };
    // }

    //airportexists.pictures = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      airportexists.pictures = airportexists.pictures || []; 

      airportexists.pictures.push(file.buffer);

      const savedAirport = await airportexists.save();
    }
  
    
    // files.forEach((file) => {
    //   //var i = 0;
    //   //i++
    //   //const buffer = Buffer.from(file.buffer); 
    //   airportexists.pictures.push(file.buffer);
    // });
  
    return "Pictures added successfully";
  }

  //front-end
  async getAirportCoordinates(token: string, code: string): Promise<{ name: string, code: string, pictures: Buffer[], latitude: number, longitude: number, rating: number }> {
  
    const airport = await this.airportModel.findOne({ code });
  
    if (!airport) {
      throw new NotFoundException('Airport not found');
    }
  
    const { name, latitude, longitude, pictures, rating } = airport;

    return { name, code, pictures, latitude, longitude, rating };
  }

  // async giveAirportRating(code: string, rating: number): Promise<number> {
  //   const airport = await this.airportModel.findOne({ code }).exec();

  //   if (!airport) {
  //     throw new NotFoundException('Airport not found');
  //   }

  //   if (rating < 1 || rating > 5) {
  //     throw new BadRequestException('Invalid rating value');
  //   }

  //   // Calculate the new average rating
  //   const totalRating = airport.rating * airport.numberofreviews + rating;
  //   const totalReviews = airport.numberofreviews + 1;
  //   const averageRating = totalRating / totalReviews;

  //   // Update the airport's average rating and number of reviews
  //   airport.rating = averageRating;
  //   airport.numberofreviews = totalReviews;

  //   // Save the updated airport
  //   await airport.save();

  //   return averageRating;
  // }

  async getAirportsByCategory(category: Categories): Promise<Airport[]> {
    const airports = await this.airportModel.find({ category }).exec();
    return airports;
  }

  async getAllAirports(): Promise<Airport[]> {
    return this.airportModel.aggregate([
      {
        $project: {
          _id: 1,
          city: 1,
          country: 1,
          code: 1,
          pictures: { $arrayElemAt: ['$pictures', 0] },
        },
      },
    ]).exec();
  }

  async getAirportsWithLowestPriceByCategory(category: Categories) {
    try {
      const airports = await this.airportModel.find({ category }).exec();
  
      const airportsWithDetails = await Promise.all(
        airports.map(async (airport) => {
          const flights = await this.flightModel
            .find({ arrivalAirport: airport.code })
            .exec();
  
          let lowestPrice = null;
  
          flights.forEach((flight) => {
            flight.classes.forEach((flightClass) => {
              if (lowestPrice === null || flightClass.price < lowestPrice) {
                lowestPrice = flightClass.price;
              }
            });
          });
  
          const [name, picture] = await Promise.all([
            airport.name,
            this.airportModel
              .findById(airport._id)
              .select('pictures')
              .populate({ path: 'pictures', options: { limit: 1 } })
              .exec(),
          ]);
  
          return {
            airportCode: airport.code,
            name,
            lowestPrice,
            picture: picture.pictures.length ? picture.pictures[0] : null,
          };
        })
      );
  
      return airportsWithDetails;
    } catch (error) {
      throw new Error('Error fetching airports by category');
    }
  }


  async getAirportbyId(code: string): Promise<Airport[]> {
    return this.airportModel.aggregate([
      {
        $match: { code: code.toUpperCase() },
      },
      {
        $project: {
          _id: 1,
          city: 1,
          country: 1,
          code: 1,
          pictures: 1,
        },
      },
    ]).exec();
  }

  async countAirports() {
    const count = await this.airportModel.count();
      console.log(count.toString())
    if (!count)
      throw new NotFoundException('Airports not found');

    return {count} ;
  }

  
  // async getAirportsByCategory(category: string): Promise<{ price: number | null, name: string, image: Buffer | null }[]> {
  //   try {
  //     // Find airports by category
  //     const airports = await this.airportModel.find({ category }).exec();
  
  //     // Fetch the lowest price for each airport
  //     const airportIds = airports.map((airport) => airport._id);
  //     const lowestPrices = await this.flightModel.aggregate([
  //       { $match: { destination: { $in: airportIds } } },
  //       { $group: { _id: '$destination', lowestPrice: { $min: '$price' } } }
  //     ]).exec();
  
  //     // Map the lowest prices to the corresponding airports
  //     const airportsWithPrices = airports.map((airport) => {
  //       const lowestPrice = lowestPrices.find(
  //         (price) => price._id.toString() === airport._id.toString()
  //       );
  //       const firstImage = airport.pictures.length > 0 ? airport.pictures[0] : null;
  //       return {
  //         price: lowestPrice ? lowestPrice.lowestPrice : null,
  //         name: airport.name,
  //         image: firstImage
  //       };
  //     });
  
  //     return airportsWithPrices;
  //   } catch (error) {
  //     console.error('Error fetching airports by category:', error);
  //     throw error;
  //   }
  // }


  
}


