import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompanySchema } from './entities/company.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/token.service';

@Module({

  imports: [ 
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema}]),
  ],
    
  controllers: [CompaniesController],
  providers: [CompaniesService, TokenService]
})
export class CompaniesModule {}
