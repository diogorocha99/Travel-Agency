import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { TokenService } from 'src/token.service';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './entities/purchase.entity';
import { Model } from 'mongoose';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Flight } from 'src/flights/entities/flight.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>, 
    @InjectModel(Company.name) private companyModel: Model<Ticket>, 
    @InjectModel(Flight.name) private flightModel: Model<Flight>, 
    private readonly tokenService: TokenService,
  ) {}

  create(createPurchaseDto: CreatePurchaseDto) {
    return 'This action adds a new purchase';
  }

  findAll() {
    return `This action returns all purchases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }


  async getPurchasesByUser(token: string): Promise<any[]> {
    const { id, role } = this.tokenService.decodeToken(token);
  
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }
  
    const userId = id;
  
    const purchases = await this.purchaseModel.find({ userId }).exec();
  
    const result: any[] = [];
  
    for (const purchase of purchases) {
      const { ticketId, totalPrice, bagsCount, purchaseDate } = purchase;
  
      const ticket = await this.ticketModel.findById(ticketId).populate('flight').exec();
  
      if (ticket) {
        const { qrCode, isActive, flight, class: ticketClass } = ticket;
        const { companyId, arrivalTime, departureTime, arrivalAirport, departureAirport, classes } = flight;
  
        // Search for the corresponding company
        const company = await this.companyModel.findById(companyId).exec();
        const companyName = company?.get('companyName');
  
  
        result.push({
          ticketId,
          totalPrice,
          bagsCount,
          purchaseDate,
          qrCode,
          isActive,
          companyName,
          arrivalAirport,
          departureAirport,
          departureTime,
          arrivalTime,
          class: ticketClass, 
        });
      }
    }
  
    return result;
  }
  

  async calculateSpendingPercentage(): Promise<number> {
    const currentDate = new Date();
    const previousYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
    const previousYearEnd = new Date(currentDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
  
    const currentYearTotalPrice = await this.purchaseModel.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: previousYearEnd, // Filter purchases from previous year end date to current date
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: '$totalPrice',
          },
        },
      },
    ]);
  
    console.log(currentYearTotalPrice);
  
    const previousYearTotalPrice = await this.purchaseModel.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: previousYearStart, // Filter purchases from previous year start date to previous year end date
            $lte: previousYearEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: '$totalPrice',
          },
        },
      },
    ]);
  
    console.log(previousYearTotalPrice);
  
    const currentYearPrice = currentYearTotalPrice.length > 0 ? currentYearTotalPrice[0].totalPrice : 0;
    const previousYearPrice = previousYearTotalPrice.length > 0 ? previousYearTotalPrice[0].totalPrice : 0;
  
    console.log(currentYearPrice - previousYearPrice);
    console.log((currentYearPrice - previousYearPrice) / previousYearPrice);
  
    const percentage = this.calculatePercentage(currentYearPrice - previousYearPrice, previousYearPrice);
    const roundedPercentage = Number(percentage.toFixed(0));

    return roundedPercentage
  }
  
  private calculatePercentage(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return (value / total) * 100;
  }


  async getPurchasesPerMonthYearly(year: number): Promise<number[]> {
    try {
      const purchases = await this.purchaseModel.find({
        purchaseDate: {
          $gte: new Date(year, 0, 1), // Start of the year
          $lte: new Date(year, 11, 31), // End of the year
        },
      }).select('totalPrice purchaseDate').exec();
  
      const purchasesPerMonthYearly: number[] = Array(12).fill(0); // Initialize array with 0 values
  
      for (const purchase of purchases) {
        const purchaseYear = purchase.purchaseDate.getFullYear();
        const purchaseMonth = purchase.purchaseDate.getMonth();
        const purchaseDay = purchase.purchaseDate.getDate();
  
        if (
          purchaseYear == year &&
          purchaseMonth >= 0 &&
          purchaseMonth <= 11 &&
          purchaseDay >= 1 &&
          purchaseDay <= 31
        ) {
          purchasesPerMonthYearly[purchaseMonth] += purchase.totalPrice;
        }
      }
  
      return purchasesPerMonthYearly;
    } catch (error) {
      throw new Error(error);
    }
  }

}
