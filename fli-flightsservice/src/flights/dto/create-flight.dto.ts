import { IsString, IsNumber, IsEnum, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ClassDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  availableSeats: number;
}

export class CreateFlightDto {
  @IsString()
  departureAirport: string;

  @IsString()
  arrivalAirport: string;

  @IsString()
  departureTime: string;

  @IsString()
  arrivalTime: string;

  @ValidateNested({ each: true })
  @Type(() => ClassDto)
  classes: ClassDto[];

  @IsEnum(['active', 'canceled', 'landed'])
  status: string;

  @IsString()
  companyId: string;
}