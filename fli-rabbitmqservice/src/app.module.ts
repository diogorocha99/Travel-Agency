import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitModule } from './rabbit/rabbit.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://fli:flidatabase@fli.fnnufzd.mongodb.net/fliusers?retryWrites=true&w=majority'),
    RabbitModule,
    
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
