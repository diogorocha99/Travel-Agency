import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './entities/rating.entity';
import { TokenService } from 'src/token.service';
import { Airport } from 'src/airports/entities/airport.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Airport.name) private airportModel: Model<Airport>,
    private readonly tokenService: TokenService,
     ) {}


  // create(createRatingDto: CreateRatingDto) {
  //   return 'This action adds a new rating';
  // }

  // findAll() {
  //   return `This action returns all rating`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} rating`;
  // }

  // update(id: number, updateRatingDto: UpdateRatingDto) {
  //   return `This action updates a #${id} rating`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} rating`;
  // }


  async createRating(token: string, airportCode: string, rating: number): Promise<Rating> {

    const { id, role } = this.tokenService.decodeToken(token);
    const userId = id;


    const newRating = new this.ratingModel({ userId, airportCode, rating });
    return await newRating.save();
  }

  async updateRating(token: string, airportCode: string, rating: number): Promise<Rating> {
    const { id, role } = this.tokenService.decodeToken(token);
    const userId = id;
  
    const updatedRating = await this.ratingModel.findOneAndUpdate(
      { userId, airportCode },
      { rating },
      { new: true }
    );
  
    if (!updatedRating) {
      throw new NotFoundException('Rating not found');
    }
  
    return updatedRating;
  }

  async calculateAverageRating(airportCode: string): Promise<number> {
    const ratings = await this.ratingModel.find({ airportCode }).exec();
    const totalRatings = ratings.length;
  
    if (totalRatings === 0) {
      return 0; // Return 0 if there are no ratings
    }
  
    const sumOfRatings = ratings.reduce((total, rating) => total + rating.rating, 0);
    const averageRating = sumOfRatings / totalRatings;
  
    const airport = await this.airportModel.findOne({ code: airportCode }).exec();
    if (!airport) {
      throw new NotFoundException('Airport not found');
    }
  
    airport.rating = averageRating;
    await airport.save();
  
    return averageRating;
  }
}
