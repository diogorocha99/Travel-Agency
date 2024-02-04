import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitController } from './rabbit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitConsumer } from './rabbit.consumer';
import { RabbitSchema } from './entities/rabbitconsumer';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: 'Rabbit', schema: RabbitSchema }]), ],

  controllers: [RabbitController],
  providers: [RabbitService, RabbitConsumer]
})
export class RabbitModule {}
