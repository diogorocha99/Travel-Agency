import { LoginDto } from './dto/login.dto';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { Controller, Get, Post, Body, Param, Delete, Headers, Put, UploadedFile, BadRequestException, UseInterceptors, UseGuards } from '@nestjs/common';
import { error } from 'console';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard, SkipThrottle, Throttle } from '@nestjs/throttler'


@UseGuards(ThrottlerGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @Throttle(20, 60)
  @Post('/Register')
  register(@Body() registerDto: RegisterDto, @Headers('fcmToken') fcmToken: string) {
    return this.usersService.register(registerDto, fcmToken);
  }
  // @Throttle(3, 60)
  @Post('/Login')
  login(@Body() loginDto: LoginDto,@Body('fcmToken') fcmToken?: string) {
    return this.usersService.login(loginDto, fcmToken);
  }

  @Get('/FindAll')
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  
  @Get('/UserTokenInformation')
  usertokendata(@Headers('token') token: string): { id: string; role: string } {

    const decodedToken = this.usersService.decodeToken(token);

    const { id, role } = decodedToken;
    return { id, role };
  }

  @Put('/ChangePassword')
  changepassword(
    @Headers('email') email: string,
    @Headers('oldpassword') oldPassword: string,
    @Headers('newpassword') newPassword: string,) {
      
      return this.usersService.changepassword(email, oldPassword, newPassword);
  }
  
  @Put('/DeleteAccount')
  deleteaccount(@Headers('token') token: string, @Headers('password') password: string,) {
    return this.usersService.deleteaccount(token, password);
  }

  @Post('/UploadPicture')
  @UseInterceptors(FileInterceptor('file'))
  uploadpicture(@Headers('token') token: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(error);
    }
  
    return this.usersService.uploadpicture(token, file);
  }

  @Get('email-exists')
  async emailExists(@Headers('email') email: string): Promise<void> {


    await this.usersService.emailExists(email);

  }



  @Put('/Permissions')  
  //@UseGuards(RoleMiddleware)
  givepermissions(@Headers('token') token: string, @Headers('email') email: string) {
    return this.usersService.givepermissions(token, email);
  }

  @Get('/UserData')
  async userdata(@Headers('token') token: string): Promise<{ email: string; name: string, fcmToken: string }> {

    const { email, name, fcmToken } = await this.usersService.getUserEmailAndName(token);

    return { email, name, fcmToken }

  }


  @Get('/UserPicture')
  async getUserImageBuffer(@Headers('token') token: string): Promise<{ picture: string }> {
    try {
      const { picture } = await this.usersService.getUserImageData(token);
      return { picture };
    } catch (error) {
      console.error('Error fetching user image:', error);
      throw error;
    }
  }

}
