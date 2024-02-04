import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ticket} from 'src/tickets/entities/ticket.entity';

@Schema({ timestamps: true })
export class Purchase extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  ticketId : string ;

  @Prop({ required: true })
  totalPrice: number;

  // @Prop({ required: true })
  // paymentIntentId: string;

  @Prop({ required: true })
  bagsCount: number;

  @Prop({ type: Date, default: Date.now })
  purchaseDate: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);