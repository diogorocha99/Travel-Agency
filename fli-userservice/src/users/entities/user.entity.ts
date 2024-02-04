import { Document } from 'mongoose';
import { MaxLength, MinLength } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.entity';

@Schema({ timestamps: true })
export class User extends Document {


  @Prop()
  @MinLength(3, { message: 'Name is too short, must contain at least 3 characters.' })
  @MaxLength(150, { message: 'Name exceeded the maximum length.' })
  name: string;

  @Prop({ unique: [true, 'Email already exists.'] })
  @MaxLength(500, { message: 'Email exceeded the maximum length.' })
  email: string;

  @Prop()
  @MinLength(8, { message: 'Password is too short.' })
  @MaxLength(150, { message: 'Password exceeded the maximum length.' })
  password: string;

  @Prop()
  @MaxLength(6, { message: 'Role exceeded the maximum length.' })
  role: Role;

  @Prop()
  @MaxLength(150, { message: 'Credit card number exceeded the maximum length.' })
  creditCard: string;

  @Prop({ type: Buffer })
  picture: Buffer;

  @Prop()
  @MaxLength(150, { message: 'Ocupation exceeded the maximum length.' })
  ocupation: string;

  @Prop()
  @MaxLength(50, { message: 'Phone number exceeded the maximum length.' })
  phone: string;

  @Prop({ default: true }) 
  isActive: boolean;

  @Prop()
  fcmToken?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);