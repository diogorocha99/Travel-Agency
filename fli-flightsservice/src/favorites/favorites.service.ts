import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Airport } from 'src/airports/entities/airport.entity';
import { InjectModel } from '@nestjs/mongoose';
import { TokenService } from 'src/token.service';
import { Model } from 'mongoose';
import { Favorite } from './entities/favorite.entity';


@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    @InjectModel(Airport.name) private airportModel: Model<Airport>, 
    private readonly tokenService: TokenService,
  ) {}

  create(createFavoriteDto: CreateFavoriteDto) {
    return 'This action adds a new favorite';
  }

  findAll() {
    return `This action returns all favorites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }

  async addFavoriteAirport(token: string, code: string): Promise<string> {


    const { id, role } = this.tokenService.decodeToken(token)

    const userId = id;

    const newFavorite = new this.favoriteModel({ userId, code });
    await newFavorite.save();

    return 'Favorite airport added successfully';
  }


  async deleteFavoriteAirport(token: string, code: string): Promise<string> {
    const { id } = this.tokenService.decodeToken(token);
    const userId = id;

    const favorite = await this.favoriteModel.findOneAndDelete({ userId, code }).exec();

    if (!favorite) {
      throw new NotFoundException('Favorite airport not found');
    }

    return 'Favorite airport deleted successfully';
  }


  async getFavoriteAirportsByUserId(token: string): Promise<{ city: string; image: string | null }[]> {
    const { id } = this.tokenService.decodeToken(token);
    const userId = id;

    const favoriteAirports = await this.favoriteModel.find({ userId }).exec();

    const airportIds = favoriteAirports.map((favorite) => favorite.code);

    const airports = await this.airportModel.find({ code: { $in: airportIds } }).exec();

    const airportsWithDetails = airports.map((airport) => {
      const { city, pictures } = airport;
      let image = null;

      if (pictures.length > 0) {
        const buffer = pictures[0];
        image = buffer.toString('base64');
      }

      return { city, image };
    });

    return airportsWithDetails;
  }
}


