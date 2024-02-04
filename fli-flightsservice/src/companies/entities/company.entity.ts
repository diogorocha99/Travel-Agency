import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ type: Buffer })
  companyPicture: Buffer;

  @Prop({ required: false })
  priceOfBags: number;

  @Prop( { required: true } )
  allowsResell: boolean;

}

export const CompanySchema = SchemaFactory.createForClass(Company);