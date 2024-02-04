import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Flight } from 'src/flights/entities/flight.entity';

//export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Flight })
  flight: Flight;

  @Prop({ required: true })
  bagsCount: number;

  @Prop( /*{required: true  }*/)
  qrCode: Buffer;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  class: string;

  @Prop({ type: Date, default: Date.now })
  purchaseDate: Date;

}

export const TicketSchema = SchemaFactory.createForClass(Ticket);