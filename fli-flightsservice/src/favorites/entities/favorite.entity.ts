import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  code: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);