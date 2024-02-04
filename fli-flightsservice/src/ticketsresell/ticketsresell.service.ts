import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateTicketsresellDto } from './dto/create-ticketsresell.dto';
import { UpdateTicketsresellDto } from './dto/update-ticketsresell.dto';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Flight} from 'src/flights/entities/flight.entity';
import { Model } from 'mongoose';
import { Company } from 'src/companies/entities/company.entity';
import { TokenService } from 'src/token.service';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { EmailService } from 'src/email.service';
import { TicketResell } from './entities/ticketsresell.entity';


@Injectable()
export class TicketsresellService {
  constructor(
    @InjectModel(TicketResell.name) private ticketresellModel: Model<TicketResell>, 
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>, 
    @InjectModel(Flight.name) private flightModel: Model<Flight>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    private readonly tokenService: TokenService,
    private readonly emailservice: EmailService,

    ) {}


  create(createTicketsresellDto: CreateTicketsresellDto) {
    return 'This action adds a new ticketsresell';
  }

  findAll() {
    return `This action returns all ticketsresell`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketsresell`;
  }

  update(id: number, updateTicketsresellDto: UpdateTicketsresellDto) {
    return `This action updates a #${id} ticketsresell`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketsresell`;
  }

  async resellTicket(token: string, ticketId: string, price: number): Promise<TicketResell> {
    const { id, role } = this.tokenService.decodeToken(token);
    const userId = id;
  
    // Get the original ticket information
    const ticket = await this.ticketModel.findById(ticketId).exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
  
    const departureTime = new Date(ticket.flight.departureTime);
  
    // Get the company information
    const company = await this.companyModel.findById(ticket.flight.companyId).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    // Check if the company allows resell of tickets
    if (!company.allowsResell) {
      throw new BadRequestException('This company does not allow the resale of tickets');
    }
  
    // Set the bidding end date before the departure time
    const biddingEndDate = new Date(departureTime);
    biddingEndDate.setDate(biddingEndDate.getDate() - 1); // Set bidding end date one day before departure
  
    // Check if the bidding end date is before the flight date
    // if (biddingEndDate >= departureTime) {
    //   throw new BadRequestException('Bidding end date must be before the flight departure date');
    // }
  
    // Get the purchase information
    const purchase = await this.purchaseModel.findOne({ ticketId, userId }).exec();
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
  
    const maxSellingPrice = purchase.totalPrice;
  
    if (price > maxSellingPrice) {
      throw new BadRequestException('Selling price cannot be higher than the original purchase price');
    }
  
    // Create the ticket resell record
    const resellTicket = new this.ticketresellModel({
      ticketId,
      sellerId: userId,
      initialPrice: price,
      biddingEndTime: biddingEndDate,
    });
  
    // Save the resell ticket record to the database
    await resellTicket.save();
  
    const body = `
      <p>Dear User,</p>
      <p>Congratulations! Your tickets have been successfully listed for resell.</p>
      <p>You can manage your resell tickets by visiting the following link:</p>
      <a href="http://localhost:3010/ticketsresell/mytickets/">Manage Resell Tickets</a>
      <p>Thank you for using our services!</p>
    `;
  
    this.emailservice.sendEmail("ProjetosIpcaMS@outlook.pt", "Fli Tickets purchased", body);
  
    return resellTicket;
  }


  async acceptBidAndFinishResell(ticketResellId: string, token: string): Promise<Ticket> {
    const { id: userId } = this.tokenService.decodeToken(token);
    
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
  
    const ticketId = ticketResellId;

    // Get the resell ticket information
    const ticketResell = await this.ticketresellModel.findOne({ ticketId } ).exec();
    if (!ticketResell) {
      throw new NotFoundException('Resell ticket not found');
    }

    if (ticketResell.isCompleted = true) {
      throw new BadRequestException('Bidding already ended');
    }

    const currentDate = Date.now();

    // Check if the bidding end date is before the current date and time
    if (ticketResell.biddingEndTime.getTime() <= currentDate) {
      ticketResell.isCompleted = true;

      await ticketResell.save();
      throw new BadRequestException('Bidding end date ended, cannot see offers');
    }
  
    // Get the original ticket associated with the resell ticket
    const originalTicket = await this.ticketModel.findById(ticketResell.ticketId).exec();
    if (!originalTicket) {
      throw new NotFoundException('Original ticket not found');
    }
  
    // Check if the original ticket belongs to the user
    if (originalTicket.userId !== userId) {
      throw new UnauthorizedException('Ticket does not belong to the user');
    }
  
    ticketResell.isCompleted = true;

    await ticketResell.save();

    // Update the original ticket with the buyer ID
    originalTicket.userId = ticketResell.sellerId;

    await originalTicket.save();
  
    return originalTicket;
  }


  async makeOffer(token: string, ticketResellId: string, offerPrice: number): Promise<TicketResell> {
    const { id: userId } = this.tokenService.decodeToken(token);
  
    const ticketId = ticketResellId;
  
    // Get the resell ticket information
    const ticketResell = await this.ticketresellModel.findOne({ ticketId }).exec();
    if (!ticketResell) {
      throw new NotFoundException('Resell ticket not found');
    }

    if (ticketResell.isCompleted = true) {
      throw new BadRequestException('Bidding already ended');
    }

    const currentDate = Date.now();


    // Check if the bidding end date is before the current date and time
    if (ticketResell.biddingEndTime.getTime() <= currentDate) {
      ticketResell.isCompleted = true;

      await ticketResell.save();
      throw new BadRequestException('Bidding end date ended, cant make offers');
    }

  
    // Check if the offer price is lower than the current highest offer
    if (offerPrice <= ticketResell.initialPrice || offerPrice <= ticketResell.currentHighestBid) {
      throw new BadRequestException('Offer price must be higher than the current highest offer');
    }
  
    const ticketResel = await this.ticketresellModel.findOneAndUpdate(
      { ticketId: ticketResellId },
      {
        $set: {
          highestBidderId: userId,
          currentHighestBid: offerPrice,
        },
      },
      { new: true }
    ).exec();



    // // Create the ticket offer
    // const ticketOffer = new this.ticketresellModel({
    //   ticketId :ticketResellId,
    //   sellerId : userId,
    //   offerPrice,
    //   offerTime: new Date(),
    // });
  
    // Save the ticket offer to the database
    //await ticketOffer.save();
  
    // Update the resell ticket with the new highest offer information
    // ticketResell.currentHighestBid = offerPrice;
    // ticketResell.highestBidderId = userId;

    //await ticketResell.save();
  
    const body = `
      <p>Dear User,</p>
      <p>Congratulations! You have received an offer for your ticket.</p>
      <p>Offer Price: $${offerPrice}</p>
      <p>You can view and manage your resell tickets by visiting the following link:</p>
      <a href="http://localhost:3010/ticketsresell/mytickets/">Manage Resell Tickets</a>
      <p>Thank you for using our services!</p>
    `;
  
    this.emailservice.sendEmail("ProjetosIpcaMS@outlook.pt", "Fli Tickets purchased", body);
  
    return ticketResel;
  }

  async getMyResellTickets(token: string): Promise<{ ticket: Ticket, currentHighestBid: number, biddingEndTime: Date }[]> {
    const { id: userId } = this.tokenService.decodeToken(token);
  
    // Retrieve all resell tickets created by the user that are not completed
    const resellTickets = await this.ticketresellModel.find({ sellerId: userId, isCompleted: false }).exec();
  
    // Map the resell tickets to the desired result format
    const result: { ticket: Ticket, currentHighestBid: number, biddingEndTime: Date }[] = [];
    for (const resellTicket of resellTickets) {
      const ticket = await this.ticketModel.findById(resellTicket.ticketId).exec();
      if (ticket) {
        const { currentHighestBid, biddingEndTime } = resellTicket;
        result.push({ ticket, currentHighestBid, biddingEndTime });
      }
    }
  
    return result;
  }


  async getAllResellTickets(): Promise<TicketResell[]> {
    const resellTickets = await this.ticketresellModel.find({ isCompleted: false }).exec();
    return resellTickets;
  }

}
