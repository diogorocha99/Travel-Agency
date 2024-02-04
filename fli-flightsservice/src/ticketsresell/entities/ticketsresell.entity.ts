import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TicketResell extends Document {
  @Prop({ required: true })
  ticketId: string;

  @Prop({ required: false })
  sellerId: string;

  @Prop({ type: Number, required: false })
  initialPrice: number;

  @Prop({ type: Number, default: 0 })
  currentHighestBid: number;

  @Prop({ default: null })
  highestBidderId: string;

  @Prop({ type: Date, required: false })
  biddingEndTime: Date;

  @Prop({ required: true, default: false })
  isCompleted: boolean;
}

export const TicketResellSchema = SchemaFactory.createForClass(TicketResell);