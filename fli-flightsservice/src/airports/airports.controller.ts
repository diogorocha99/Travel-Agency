import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { Airport, Categories} from './entities/airport.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  // @Post()
  // create(@Body() createAirportDto: CreateAirportDto) {
  //   return this.airportsService.create(createAirportDto);
  // }

  // @Get()
  // findAll() {
  //   return this.airportsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.airportsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airportsService.remove(+id);
  }

  @Post('/AddAirport')
  createairport(@Body() Airport: CreateAirportDto, @Headers('token') token: string) {
    return this.airportsService.createairport(Airport, token);
  }

  @Post('/UploadPictures')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadpicture(@Headers('token') token: string, @Headers('code') code: string , @UploadedFiles() file: Express.Multer.File[]) {
    return this.airportsService.uploadpicture(token, code, file)
  }

  @Get('getCoordinates')
  getAirportCoordinates(@Headers('token') token: string, @Headers('code') code: string) {
      const coordinates = this.airportsService.getAirportCoordinates(token, code);
      return coordinates;
  }

  // @Post(':code/rating')
  // async giveAirportRating(
  //   @Param('code') code: string,
  //   @Headers('rating') rating: number,
  // ): Promise<number> {
  //   const averageRating = await this.airportsService.giveAirportRating(code, rating);
  //   return averageRating;
  // }




  @Get('/category/:category')
  async getAirportsByCategory(@Param('category') category: Categories) {
    try {
      const airports = await this.airportsService.getAirportsWithLowestPriceByCategory(
        category,
      );
      return airports;
    } catch (error) {
      throw new Error('Error retrieving airports by category');
    }
  }

  @Get('/GetAirports')
  async getAllAirports(): Promise<Airport[]> {
    return this.airportsService.getAllAirports();
  }

  @Get('ByCode/:code')
  async getAirportbyId(@Param('code') code: string) {
    try {
      const airports = await this.airportsService.getAirportbyId(code);
      return { data: airports };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('/Count')
  async countAirports() {
    try {
      const count = await this.airportsService.countAirports();
      return count;
    } catch (error) {
      return { error: error.message };
    }
  }

}


