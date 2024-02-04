import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Airport } from 'src/airports/entities/airport.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  // @Get()
  // findAll() {
  //   return this.favoritesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.favoritesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
  //   return this.favoritesService.update(+id, updateFavoriteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.favoritesService.remove(+id);
  // }

  @Post('/add')
  async addFavoriteAirport(
    @Headers('token') token: string,
    @Headers('code') code: string,
  ): Promise<string> {



    // Call the service method to add the favorite airport
    await this.favoritesService.addFavoriteAirport(token, code);

    return 'Favorite airport added successfully';
  }


  @Delete()
  async deleteFavoriteAirport(
    @Headers('token') token: string,
    @Headers('code') code: string,
  ): Promise<string> {
    return this.favoritesService.deleteFavoriteAirport(token, code);
  }

  @Get()
  async getFavoriteAirportsByUserId(@Headers('token') token: string): Promise<{ city: string; image: string }[]> {
    const airports = await this.favoritesService.getFavoriteAirportsByUserId(token);
    return airports;
  }
  

}
