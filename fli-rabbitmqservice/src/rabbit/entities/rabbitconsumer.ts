import { Document } from 'mongoose';
import { MaxLength, MinLength } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Rabbit extends Document {


    @Prop()
    userid: string;

    @Prop()
    msg: string;

    

    constructor(userid: string, msg: string) {
        super();
        this.userid = userid;
        this.msg = msg;
      }
    

}


export const RabbitSchema = SchemaFactory.createForClass(Rabbit);