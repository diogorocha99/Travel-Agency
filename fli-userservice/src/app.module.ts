import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(''),
    //RateLimiterModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   isGlobal: true,
    // }),
    // MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
    
  ]

  // controllers: [AppController],
})

export class AppModule {}