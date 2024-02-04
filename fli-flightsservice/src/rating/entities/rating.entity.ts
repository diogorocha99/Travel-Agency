import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, Min, Max, IsNumber } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Rating extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  airportCode: string;

  @Prop({ required: true })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);