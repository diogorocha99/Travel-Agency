import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Headers } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { AirportsService } from 'src/airports/airports.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}


  @Post('/AddRating')
  async createRating(
    @Headers('token') token: string,
    @Headers('airportCode') airportCode: string,
    @Headers('rating') rating: number,
  ): Promise<Rating> {
    return await this.ratingService.createRating(token, airportCode, rating);
  }

  @Put('/UpdateRating')
  async updateRating(
    @Headers('token') token: string,
    @Headers('airportCode') airportCode: string,
    @Headers('rating') rating: number,
  ): Promise<Rating> {
    return await this.ratingService.updateRating(token, airportCode, rating);
  }

  // @Post()
  // create(@Body() createRatingDto: CreateRatingDto) {
  //   return this.ratingService.create(createRatingDto);
  // }

  // @Get()
  // findAll() {
  //   return this.ratingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ratingService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
  //   return this.ratingService.update(+id, updateRatingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ratingService.remove(+id);
  // }
  @Get('/GetRating')
  async calculateAverageRating(@Headers('airportCode') airportCode: string): Promise<number> {
    const averageRating = await this.ratingService.calculateAverageRating(airportCode);
    return averageRating;
  }

}
