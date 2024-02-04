import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import {Rabbit} from './entities/rabbitconsumer'

@Controller('rabbit')
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  
  @Post()
  register() {
    return this.rabbitService.registerrabbit();
  }

}
