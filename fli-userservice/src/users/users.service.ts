import { Model, ObjectId, Types  } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';
import { Multer } from 'multer';
import * as fs from 'fs';
import { RabbitMQService } from './rabbitmq.service';
import { Role } from './entities/role.entity';
import { NotificationsService } from 'src/notifications.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private readonly rabbitMQService: RabbitMQService, private readonly notificationsService: NotificationsService ) {}
  
  async register(registerDto: RegisterDto, fcmToken?: string) {
    const { name, email, password } = registerDto;

    const encryptedpassword = await bcrypt.hash(password, 12); 

    const userExists = await this.userModel.findOne(({ email }))

    if (userExists) {
      throw new UnauthorizedException('Email already registered');
    }

    const user = await this.userModel.create({
      name,
      email,
      password : encryptedpassword,
      fcmToken,
    });
    
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async login(loginDto: LoginDto, fcmToken?: string): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const userExists = await this.userModel.findOne(({ email }))

    if (!userExists || userExists.isActive == false) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (userExists && await this.comparePasswords(password, userExists.password)) {

      //userExists.password = ""

      const token = this.jwtService.sign({ id: userExists._id, role: userExists.role });


      if (fcmToken && fcmToken !== userExists.fcmToken) {
        // FCM token is provided and has changed, update it in the database
        userExists.fcmToken = fcmToken;
        await userExists.save();
      }

      
      //const tokenfcm = await this.notificationsService.generateFCMToken(uid);

      // // Check if FCM token has changed
      // if (userExists.fcmToken !== '<new-fcm-token>') {
      // // Update FCM token
        //userExists.fcmToken = fcmToken;

      //await this.userModel.updateOne({ _id: userExists._id }, { $set: { fcmToken: tokenfcm} });

        // Set the new FCM token value


      //wait userExists.save();
      //}

      await this.rabbitMQService.connect();

      await this.rabbitMQService.sendMessage(userExists.id , 'User logged in successfully');

      await this.rabbitMQService.callLogsApi();


      return { token };

    }
    else {
        

      throw new UnauthorizedException('Invalid email or password');
    }

    //return userExists
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }


  decodeToken(token: string): { id: string; role: string } | null {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
        const { id, role } = decodedToken;
          return { id: id, role: role };
    } catch (error) {
        throw new UnauthorizedException(error)
     
    }
  }

  async changepassword(email: string, oldpassword: string, newpassword: string) {
    const user = await this.userModel.findOne({ email });
  
    if (!user) {
      throw new UnauthorizedException('Invalid Email, please try again');
    }
  
    const matchpassword = await bcrypt.compare(oldpassword, user.password);
  
    if (matchpassword) {
      const encryptednewpassword = await bcrypt.hash(newpassword, 12);
      await this.userModel.updateOne({ _id: user._id }, { password: encryptednewpassword });
  
      return 'Password Changed with Success';
    } else {
      throw new UnauthorizedException('Invalid Password, please try again');
    }
  }


  async emailExists(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
  
    if (!user) {
      throw new NotFoundException('Email not found');
    }
  }


  async deleteaccount(token:string, password: string) {

    const { id, role } = this.decodeToken(token)

    const user = await this.userModel.findById(id)

    if (!await this.comparePasswords(password, user.password)) {
      throw new UnauthorizedException("Invalid Password, please try again")
    }

    if(user) {
      user.isActive = false
      await user.save();
    }

    return "Account Deleted with sucess"
  }

  async uploadpicture(token: string, file: Express.Multer.File) {
    
    const { id, role } = this.decodeToken(token)

    const user = await this.userModel.findById(id)

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.picture = file.buffer;

    const savedUser = await user.save();

    //codigo de baixo é usado para escrever o binario do buffer na diretoria que queremos, sendo assim possivel ver a imgem inteira e não em binário

    // const pictureBuffer = user.picture;

    // await fs.promises.writeFile("D:/image.jpg", pictureBuffer);

    // console.log('Image saved successfully:', "D:/imagechinese.jpg");

    return "Picture add with sucess"
  }

  async givepermissions(token: string, email: string) {

    const { id, role } = this.decodeToken(token)

    const admin = await this.userModel.findById(id)

    const user = await this.userModel.findOne(({ email }))



    if((user) && (admin.role == Role.Admin)) {
      user.role = Role.Admin
      await user.save();

      return "User permission added"

    }
    else {
      throw new NotFoundException('No permission to this route');
    }
  }

  async getUserEmailAndName(token: string): Promise<{ email: string; name: string, fcmToken: string }> {

    const { id, role } = this.decodeToken(token)

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, name, fcmToken } = user;
    
    return { email, name, fcmToken };
  }
  

  
async getUserImageData(token: string): Promise<{ picture: string }> {
  try {
    const { id, role } = this.decodeToken(token);

    // Find the user by ID in the database
    const user = await this.userModel.findById(id).exec();

    if (user) {
      // Convert the user image buffer to a base64-encoded string
      const base64String = user.picture.toString('base64');

      return { picture: base64String };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw error;
  }
}


}