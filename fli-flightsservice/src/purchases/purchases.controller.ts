import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // @Post()
  // create(@Body() createPurchaseDto: CreatePurchaseDto) {
  //   return this.purchasesService.create(createPurchaseDto);
  // }

  // @Get()
  // findAll() {
  //   return this.purchasesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchasesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
  //   return this.purchasesService.update(+id, updatePurchaseDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(+id);
  }

  @Get('/history')
  async getPurchasesByUser(@Headers('token') token: string,) {


    const purchases = await this.purchasesService.getPurchasesByUser(token);
    return { purchases };
  }



  @Get("/YearlyPercentage")
  async getYearlyPercentage() {
    const yearlyPercentage = await this.purchasesService.calculateSpendingPercentage();

    return { yearlyPercentage }; 
  }



  @Get('/purchasesPerMonthYearly/:year')
  async getPurchasesPerMonthYearly(@Param('year') year: number): Promise<number[]> {
    try {
      return await this.purchasesService.getPurchasesPerMonthYearly(year);
    } catch (error) {
      throw new Error(error);
    }
  }

}
