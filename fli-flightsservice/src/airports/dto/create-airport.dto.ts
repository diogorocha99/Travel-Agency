import { IsInt, IsNumber, Max, Min, MaxLength, MinLength, IsOptional} from 'class-validator';
import { Transform } from 'class-transformer';
// import { Categories } from '../entities/categories';
import { Categories } from '../entities/airport.entity';

export class CreateAirportDto {

  @MinLength(3, { message: 'Name is too short for the airport code' })
  @MaxLength(4, { message: 'Name exceeded the maximum length for an airport code.' })

  code: string;

  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? value : 0)
  rating: number;

  country: string;

  city: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  categorie: Categories;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? value : 0)
  numberofreviews: number;

}


  