import { Document } from 'mongoose';
import { MaxLength, MinLength, IsInt, Min, Max, IsNumber } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Categories } from './categories';


export enum Categories {
  Mountain = 'mountain',
  Desert = 'desert',
  Tropical = 'beach',
  Europe = 'europe',
  // America = 'america',
  // Asia = 'asia',
  // Oceania = 'oceania'

}

@Schema({ timestamps: true })
export class Airport extends Document {

  @Prop({ unique: [true, 'Aiport code already exists.'] })
  @MinLength(3, { message: 'Name is too short for the airport code' })
  @MaxLength(4, { message: 'Name exceeded the maximum length for a airport code.' })
  code: string

  @Prop()
  name: string;

  @Prop()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @Prop()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @Prop({ enum: Categories })
  category: Categories;

  // @Prop()
  // @IsInt()
  // numberofreviews: number;

  @Prop()
  pictures: Buffer[];

}

export const AirportSchema = SchemaFactory.createForClass(Airport);
