import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './entities/company.entity';
import { TokenService } from '../token.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Multer } from 'multer';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>, private readonly tokenService: TokenService
  ) {}

  async addCompany(token: string, companyName: string, companyPicture: Express.Multer.File, priceOfBags: number, allowsResell: boolean): Promise<Company> {

    const { id, role } = this.tokenService.decodeToken(token);

    if (role != "admin") {
      throw new UnauthorizedException("Invalid Permission")
    }



    if (!companyPicture || !companyPicture.buffer) {
      throw new Error('Invalid picture data');
    }

    const newCompany = new this.companyModel({
      companyName,
      companyPicture : companyPicture.buffer,
      priceOfBags : priceOfBags,
      allowsResell : allowsResell
    });

    const createdCompany = await newCompany.save();
    return createdCompany;
  }

  // create(createCompanyDto: CreateCompanyDto) {
  //   return 'This action adds a new company';
  // }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  // update(id: number, updateCompanyDto: UpdateCompanyDto) {
  //   return `This action updates a #${id} company`;
  // }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }


  async updateCompany(token: string, companyName: string, newcompanyName: string,  companyPic: Express.Multer.File, priceOfBags: number, allowsResell: boolean) {

    const { id, role } = this.tokenService.decodeToken(token);
  
    if (role != "admin") {
      throw new UnauthorizedException("Invalid Permission")
    }
  
    const company = await this.companyModel.findOne({ companyName });
  
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    if (companyName) {
      company.companyName = newcompanyName;
    }
  
    if (companyPic && companyPic.buffer) {
      company.companyPicture = companyPic.buffer;
    }

    if (company.priceOfBags) {
      company.priceOfBags = priceOfBags;
    }

    company.allowsResell = allowsResell;
  
    const updatedCompany = await company.save();
  }

  async checkCompanyResellPermission(companyName: string): Promise<string> {

    const company = await this.companyModel.findOne({ companyName });
  
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    const resellText = company.allowsResell ? 'Company allows resale of tickets' : 'Cannot resell tickets in this company';
  
    return resellText;
  }

}
