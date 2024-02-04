import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { RabbitMQService } from './users/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const rabbitMQService = app.get(RabbitMQService);
  await app.listen(3000);
}

bootstrap();