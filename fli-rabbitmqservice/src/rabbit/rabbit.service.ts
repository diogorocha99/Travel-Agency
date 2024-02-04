import { Injectable } from '@nestjs/common';
import { CreateRabbitDto } from './dto/create-rabbit.dto';
import { UpdateRabbitDto } from './dto/update-rabbit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rabbit } from './entities/rabbitconsumer';
import { Model, ObjectId, Types  } from 'mongoose';
import {RabbitConsumer} from './rabbit.consumer'
import { IsDate } from 'class-validator';

@Injectable()
export class RabbitService {
  constructor (@InjectModel(Rabbit.name) private rabbitModel: Model<Rabbit>, private readonly rabbitConsumer: RabbitConsumer) {}

  create(createRabbitDto: CreateRabbitDto) {
    return 'This action adds a new rabbit';
  }

  findAll() {
    return `This action returns all rabbit`;
  }
  findOne(id: number) {
    return `This action returns a #${id} rabbit`;
  }

  update(id: number, updateRabbitDto: UpdateRabbitDto) {
    return `This action updates a #${id} rabbit`;
  }

  remove(id: number) {
    return `This action removes a #${id} rabbit`;
  }

  async registerrabbit() {

    //var messagereceived = new Rabbit("", "", new Date()) 

    var messagereceived = await this.rabbitConsumer.startConsumer();

    const {userid, msg} = messagereceived

    const user = await this.rabbitModel.create({
      userid,
      msg,
    });
  
  }

}
