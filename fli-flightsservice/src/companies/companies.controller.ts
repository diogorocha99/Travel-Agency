import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Headers, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // @Post()
  // create(@Body() createCompanyDto: CreateCompanyDto) {
  //   return this.companiesService.create(createCompanyDto);
  // }

  @Post('/AddCompany')
  @UseInterceptors(FileInterceptor('file'))
  async addCompany(@Headers('token') token: string, @Headers('name') companyName: string, @UploadedFile() file: Express.Multer.File, @Headers('priceofbags') priceofbags: number, @Headers('allowresell') allowresell: boolean ) {
    const company = await this.companiesService.addCompany(token, companyName, file, priceofbags, allowresell);
    return company;
  }


  // @Get()
  // findAll() {
  //   return this.companiesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companiesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companiesService.update(+id, updateCompanyDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }

  @Put('/UpdateCompany')
  @UseInterceptors(FileInterceptor('file'))
  async updateCompany(@Headers('token') token: string, @Headers('companyName') companyName: string, @Headers('newcompanyName') newcompanyName: string, @UploadedFile() file: Express.Multer.File, @Headers('priceofbags') priceofbags: number, @Headers('allowresell') allowresell: boolean ) {
    return this.companiesService.updateCompany(token, companyName, newcompanyName, file, priceofbags, allowresell )
  }

  @Get('/resell-permission')
  async checkResellPermission(@Headers('companyname') companyname: string): Promise<string> {
    const resellText = await this.companiesService.checkCompanyResellPermission(companyname);
    return resellText;
  }

}
