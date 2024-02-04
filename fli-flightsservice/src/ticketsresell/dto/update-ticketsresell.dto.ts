import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketsresellDto } from './create-ticketsresell.dto';

export class UpdateTicketsresellDto extends PartialType(CreateTicketsresellDto) {}
