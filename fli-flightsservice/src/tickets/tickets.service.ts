import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Flight} from 'src/flights/entities/flight.entity';
import { Model } from 'mongoose';
import { Company } from 'src/companies/entities/company.entity';
import { TokenService } from 'src/token.service';
import * as qrCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import Stripe from 'stripe';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import * as path from 'path';
import { Binary } from 'mongodb';
import { EmailService } from 'src/email.service';
import axios from 'axios';
import * as admin from 'firebase-admin';
import { NotificationsService } from 'src/notifications.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { subDays, isBefore, parseISO } from 'date-fns';


@Injectable()
export class TicketsService {
  private stripe: Stripe;
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>, 
    @InjectModel(Flight.name) private flightModel: Model<Flight>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    private readonly tokenService: TokenService,
    private readonly emailservice: EmailService,
    private readonly notificationsService: NotificationsService,
  ) {}

    

  // create(createTicketDto: CreateTicketDto) {
  //   return 'This action adds a new ticket';
  // }

  // findAll() {
  //   return `This action returns all tickets`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} ticket`;
  // }

  // update(id: number, updateTicketDto: UpdateTicketDto) {
  //   return `This action updates a #${id} ticket`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} ticket`;
  // }

  async buyRoundTripTicket(token: string, departureFlightId: string, returnFlightId: string, bagsCount: number, className: string): Promise<Ticket[]> {


    const { id, role } = this.tokenService.decodeToken(token);

    // Retrieve departure and return flights
    const departureFlight = await this.flightModel.findById(departureFlightId).exec();
    const returnFlight = await this.flightModel.findById(returnFlightId).exec();
    

    // Extract class information
    const departureClass = departureFlight.classes.find((c) => c.name === className);
    const returnClass = returnFlight.classes.find((c) => c.name === className);


    if (departureClass.availableSeats <= 0 || returnClass.availableSeats <= 0) {
        throw new NotFoundException('No available seats in the selected class');
    }

    // Calculate total price
    let totalPrice = departureClass.price + returnClass.price;

    const companydeparture = await this.companyModel.findById(departureFlight.companyId);

    const companyarrival = await this.companyModel.findById(returnFlight.companyId);

    if (companydeparture && companyarrival) {
      const bagPricedeparture = companydeparture.priceOfBags;
      const bagPricearrival = companyarrival.priceOfBags;
   
      totalPrice += bagsCount * (bagPricearrival + bagPricedeparture);

    }

    const existingClassIndex = departureFlight.classes.findIndex(
      (c) => c.name === className
    );

    if (existingClassIndex !== -1) {
      // Class already exists, update its properties
      departureFlight.classes[existingClassIndex].availableSeats -= 1;
    } 


    const ticketdeparture = new this.ticketModel({
      userId: id,
      flight: {
        companyId: companydeparture._id,
        arrivalTime: departureFlight.arrivalTime,
        departureTime: departureFlight.departureTime,
        arrivalAirport: departureFlight.arrivalAirport,
        departureAirport: departureFlight.departureAirport,
        classes: departureFlight.classes,
      },
      bagsCount,
      qrCode: '',
      isActive: true,
      class: className,
      purchaseDate: new Date(),
    });


    const existingClassIndexreturn = returnFlight.classes.findIndex(
      (c) => c.name === className
    );

    if (existingClassIndexreturn !== -1) {
      // Class already exists, update its properties
      returnFlight.classes[existingClassIndex].availableSeats -= 1;
    } 


    const ticketarrival = new this.ticketModel({
      userId: id,
      flight: {
        companyId: companyarrival._id,
        arrivalTime: returnFlight.arrivalTime,
        departureTime: returnFlight.departureTime,
        arrivalAirport: returnFlight.arrivalAirport,
        departureAirport: returnFlight.departureAirport,
        classes: returnFlight.classes,
      },
      bagsCount,
      qrCode: '',
      isActive: true,
      class: className,
      purchaseDate: new Date(),
    });

    // const ticketarrival = new this.ticketModel({
    //   userId : id,
    //   flight: {
    //     returnFlight
    //   },
    //   bagsCount,
    //   qrCode: '',
    //   isActive: true,
    //   purchaseDate: new Date(),
    // });


    // this.stripe = new Stripe('YOUR_STRIPE_API_KEY', { apiVersion: '2022-11-15', });

    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: totalPrice * 100, // Stripe expects amount in cents
    //   currency: 'usd',
    // });

    const ticketdepart = ticketdeparture._id.toString();

    const qrCodeData1 = `http://host.docker.internal:3010/tickets/update-status/${ticketdepart}`;

    const qrCodeOptions = {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.92,
      margin: 1,
    };
  
    const qrCodeImageBuffer = await qrCode.toBuffer(qrCodeData1, qrCodeOptions);
    ticketdeparture.qrCode = qrCodeImageBuffer;
    // Save the ticketdeparture document to MongoDB
    await ticketdeparture.save();

    const ticketarriv = ticketarrival._id.toString();

    const qrCodeData2  = `http://host.docker.internal:3010/tickets/update-status/${ticketarriv}`;


    const qrCodeImageBuffer1 = await qrCode.toBuffer(qrCodeData2, qrCodeOptions);
    ticketarrival.qrCode = qrCodeImageBuffer1;
    // Save the ticketdeparture document to MongoDB
    await ticketarrival.save();

    //departureClass.availableSeats = departureClass.availableSeats - 1;
    
    await departureFlight.save();

    //returnClass.availableSeats = returnClass.availableSeats - 1;
    await returnFlight.save();

    const purchasedeparture = new this.purchaseModel({
      userId: id,
      ticketId: ticketdeparture._id,
      totalPrice: departureClass.price + bagsCount * (companydeparture.priceOfBags),
      //paymentIntentId: paymentIntent.id,
      bagsCount: bagsCount,
      purchaseDate: new Date(),
    });

    // Save the purchase record
    await purchasedeparture.save();

    const purchasearrival = new this.purchaseModel({
      userId: id,
      ticketId: ticketarrival._id,
      totalPrice: returnClass.price + bagsCount * (companyarrival.priceOfBags),
      //paymentIntentId: paymentIntent.id,
      bagsCount: bagsCount,
      purchaseDate: new Date(),
    });

    await purchasearrival.save();

    await ticketarrival.save();

    // Save the ticket
    await ticketdeparture.save();


    const response = await axios.get('http://host.docker.internal:3000/users/UserData', {
    headers: {
      token: token,
    },
    });

     const {email, name} = response.data;


    //Envio de email

    var body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Flight Ticket Purchase Confirmation</title>
      <style>
        /* Add your custom styles here */
        ...
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Flight Ticket Purchase Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for purchasing flight tickets. Your tickets are now available for download.</p>
          <p>To access your tickets, please click the button below:</p>
          <p><a class="button" href="http://localhost:3050/tickets/user">Access Your Tickets</a></p>
          <p>Thank you for choosing our service. Have a pleasant journey!</p>
        </div>
      </div>
    </body>
    </html>
  `

    this.emailservice.sendEmail("ProjetosIpcaMS@outlook.pt", "Fli Tickets purchased", body)

    return [ticketdeparture, ticketarrival]
  }



  async getTicketsByUser(token: string): Promise<{ name: string, email: string, bagsCount: number, qrCode: string, purchaseDate: Date, companyName: string, departureAirport: string, arrivalAirport: string, departureTime: string, arrivalTime: string, ticketClass: string }[]> {
    const { id, role } = this.tokenService.decodeToken(token);
  
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }
  
    const userId = id;
  
    const response = await axios.get('http://host.docker.internal:3000/users/UserData', {
      headers: {
        token: token,
      },
    });
  
    const { email, name } = response.data;
  
    const tickets = await this.ticketModel.find({ userId }).populate('flight').exec();
  
    const result: { name: string, email: string, bagsCount: number, qrCode: string, purchaseDate: Date, companyName: string, departureAirport: string, arrivalAirport: string, departureTime: string, arrivalTime: string, ticketClass: string }[] = [];
  
    for (const ticket of tickets) {
      const qrCodeBase64 = ticket.qrCode.toString('base64');
      const { bagsCount, purchaseDate, flight, class: ticketClass } = ticket;
      const { companyId, departureAirport, arrivalAirport, departureTime, arrivalTime } = flight;
  
      // Search for the corresponding company
      const company = await this.companyModel.findById(companyId).exec();
      const companyName = company ? company.companyName : '';
  
      result.push({ name, email, bagsCount, qrCode: qrCodeBase64, purchaseDate, companyName, departureAirport, arrivalAirport, departureTime, arrivalTime, ticketClass });
    }
  
    return result;
  }
  async getTicketQrCode(token: string, ticketId: string): Promise<{ qrCodeBinary: string }> {
    const { id, role } = this.tokenService.decodeToken(token);

    const userId = id;

    const ticket = await this.ticketModel.findOne({ userId });
  
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
  
    const qrCodeBinary = ticket.qrCode.toString('binary');

    return { qrCodeBinary };
  }


  async onlywayticket(token: string, departureFlightId: string, bagsCount: number, className: string): Promise<Ticket> {


    const { id, role } = this.tokenService.decodeToken(token);

    // Retrieve departure and return flights
    const departureFlight = await this.flightModel.findById(departureFlightId).exec();
    

    // Extract class information
    const departureClass = departureFlight.classes.find((c) => c.name === className);


    if (departureClass.availableSeats <= 0) {
      throw new UnauthorizedException('No avaiable seats in this class');
    }

    // Calculate total price
    let totalPrice = departureClass.price

    const companydeparture = await this.companyModel.findById(departureFlight.companyId);

    if (companydeparture) {
      const bagPricedeparture = companydeparture.priceOfBags;

   
      totalPrice += bagsCount * (bagPricedeparture);

    }

    const existingClassIndex = departureFlight.classes.findIndex(
      (c) => c.name === className
    );

    if (existingClassIndex !== -1) {
      // Class already exists, update its properties
      departureFlight.classes[existingClassIndex].availableSeats -= 1;
    } 



    
    const ticketdeparture = new this.ticketModel({
      userId: id,
      flight: {
        companyId: companydeparture._id,
        arrivalTime: departureFlight.arrivalTime,
        departureTime: departureFlight.departureTime,
        arrivalAirport: departureFlight.arrivalAirport,
        departureAirport: departureFlight.departureAirport,
        classes: departureFlight.classes,
      },
      bagsCount,
      qrCode: '',
      isActive: true,
      class: className,
      purchaseDate: new Date(),
    });


    // this.stripe = new Stripe('YOUR_STRIPE_API_KEY', { apiVersion: '2022-11-15', });

    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: totalPrice * 100, // Stripe expects amount in cents
    //   currency: 'usd',
    // });

    const ticketdepart = ticketdeparture._id.toString();

    const qrCodeData1 = `http://host.docker.internal:3010/tickets/update-status/${ticketdepart}`;

    const qrCodeOptions = {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.92,
      margin: 1,
    };
  
    const qrCodeImageBuffer = await qrCode.toBuffer(qrCodeData1, qrCodeOptions);
    ticketdeparture.qrCode = qrCodeImageBuffer;
    // Save the ticketdeparture document to MongoDB
    await ticketdeparture.save();


    departureClass.availableSeats = departureClass.availableSeats - 1;
    
    await departureFlight.save();

    const purchasedeparture = new this.purchaseModel({
      userId: id,
      ticketId: ticketdeparture._id,
      totalPrice: totalPrice,
      //paymentIntentId: paymentIntent.id,
      bagsCount: bagsCount,
      purchaseDate: new Date(),
    });

    // Save the purchase record
    await purchasedeparture.save();


    // Save the ticket
    await ticketdeparture.save();


    //Envio de email


    const response = await axios.get('http://host.docker.internal:3000/users/UserData', {
      headers: {
        token: token,
      },
      });
  
       const {email, name, fcmToken} = response.data;
  
  
      //Envio de email
  
      var body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Flight Ticket Purchase Confirmation</title>
        <style>
          /* Add your custom styles here */
          ...
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Flight Ticket Purchase Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for purchasing flight tickets. Your tickets are now available for download.</p>
            <p>To access your tickets, please click the button below:</p>
            <p><a class="button" href="http://localhost:3050/tickets/user">Access Your Tickets</a></p>
            <p>Thank you for choosing our service. Have a pleasant journey!</p>
          </div>
        </div>
      </body>
      </html>
    `
  
    this.emailservice.sendEmail("ProjetosIpcaMS@outlook.pt", "Fli Tickets purchased", body)

    await this.notificationsService.sendNotification(
      fcmToken,
      'Flight Ticket Purchase Confirmation',
      'Your tickets are now available for download.',
      'FLIGHT_TICKET_NOTIFICATION',
      { link: 'http://host.docker.internal:3020/ticketsresell/mytickets' }
    );


    //await this.notificationsService.sendNotification(fcmToken, 'Flight Ticket Purchase Confirmation', 'Your tickets are now available for download.');

    // const userToken = fcmToken;
    // const notification: admin.messaging.NotificationMessagePayload = {
    //   title: 'Flight Ticket Purchase Confirmation',
    //   body: 'Your tickets are now available for download.',
    //   clickAction: 'FLIGHT_TICKET_NOTIFICATION',
    // };
    // const data: admin.messaging.DataMessagePayload = {
    //   link: 'http://localhost:3010/ticketsresell/mytickets',
    // };
    // const message: admin.messaging.Message = {
    //   token: userToken,
    //   notification,
    //   data,
    // };

    // await admin.messaging().send(message);



    return ticketdeparture
  }

  async deactivateTicket(ticketId: string): Promise<void> {
    try {
      const result = await this.ticketModel.updateOne({ _id: ticketId }, { isActive: false });
      if (result.modifiedCount === 0) {
        console.log('Ticket not found or not updated');
        return;
      }
  
      console.log('Ticket deactivated successfully');
    } catch (error) {
      console.log('Error deactivating ticket:', error);
      throw error;
    }
  }
  
  async getTicketsByUserActive(token: string): Promise<{
    ticketId: string;
    name: string;
    email: string;
    bagsCount: number;
    purchaseDate: Date;
    companyName: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    ticketClass: string;
  }[]> {
    const { id, role } = this.tokenService.decodeToken(token);
  
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }
  
    const userId = id;
  
    const response = await axios.get('http://host.docker.internal:3000/users/UserData', {
      headers: {
        token: token,
      },
    });
  
    const { email, name } = response.data;
  
    const tickets = await this.ticketModel.find({ userId }).populate('flight').exec();
  
    const result: {
      ticketId: string;
      name: string;
      email: string;
      bagsCount: number;
      purchaseDate: Date;
      companyName: string;
      departureAirport: string;
      arrivalAirport: string;
      departureTime: string;
      arrivalTime: string;
      ticketClass: string;
    }[] = [];
  
    const currentDate = new Date();
  
    for (const ticket of tickets) {
      //const qrCodeBase64 = ticket.qrCode.toString('base64');
      const { _id: ticketId, bagsCount, purchaseDate, flight, class: ticketClass } = ticket;
      const { companyId, departureAirport, arrivalAirport, departureTime, arrivalTime } = flight;
  
      // Search for the corresponding company
      const company = await this.companyModel.findById(companyId).exec();
      const companyName = company ? company.companyName : '';
  
      const departureTimeDate = parseISO(departureTime);
  
      if (isBefore(currentDate, departureTimeDate)) {
        result.push({
          ticketId,
          name,
          email,
          bagsCount,
          purchaseDate,
          companyName,
          departureAirport,
          arrivalAirport,
          departureTime,
          arrivalTime,
          ticketClass,
        });
      }
    }
  
    return result;
  }

}
