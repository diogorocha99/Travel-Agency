import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {message: 'Name is too short, must contain at least 3 characters.'})
  @MaxLength(150, { message: 'Name exceeded the maximum length.' })
  name: string;

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