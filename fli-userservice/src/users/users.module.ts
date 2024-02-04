import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { JwtStrategy } from './jwtstrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleMiddleware } from './role.middleware';
import { RabbitMQService } from './rabbitmq.service';
import { NotificationsService } from 'src/notifications.service';


@Module({
  imports: [ 
    JwtModule.register({
      secret: 'chavedojwt',
      signOptions: { expiresIn: '1h' }, 
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), ],
 
  controllers: [UsersController],
 
  providers: [UsersService, RoleMiddleware, RabbitMQService, NotificationsService ],


  //exports: [JwtStrategy, PassportModule],
  
})

export class UsersModule {}