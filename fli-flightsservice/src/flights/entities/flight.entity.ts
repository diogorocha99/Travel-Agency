import { Schema, Prop, SchemaFactory,  } from '@nestjs/mongoose';
import { Document, Types  } from 'mongoose';

enum FlightStatus {
  Active = 'active',
  Canceled = 'canceled',
  Landed = 'landed',
}

class FlightClass {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  availableSeats: number;
}

@Schema({ timestamps: true })
export class Flight extends Document {
  @Prop({ required: true })
  departureAirport: string;

  @Prop({ required: true })
  arrivalAirport: string;

  @Prop({ required: true })
  departureTime: string;

  @Prop({ required: true })
  arrivalTime: string;

  @Prop({ type: [{name: String, price: Number, availableSeats: Number }] })
  classes: FlightClass[];

  @Prop({ required: true, enum: FlightStatus, default: FlightStatus.Active })
  status: FlightStatus;

  @Prop({ required: true })
  companyId: string;
}

export const FlightSchema = SchemaFactory.createForClass(Flight);