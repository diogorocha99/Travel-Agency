import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class LoginDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Email with wrong format, please try again.' })
    @MaxLength(500, { message: 'Email exceeded the maximum length.' })
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password is too short.' })
    @MaxLength(150, { message: 'Password exceeded the maximum length.' })
    password: string;

}