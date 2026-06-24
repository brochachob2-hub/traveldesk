import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BookingTravelerDto {
  @IsString()
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MaxLength(80)
  lastName!: string;
}

export class CreateBookingDto {
  @IsString()
  organizationSlug!: string;

  @IsString()
  departureId!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsInt()
  @Min(1)
  @Max(20)
  seats!: number;

  @ValidateNested({ each: true })
  @Type(() => BookingTravelerDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  travelers!: BookingTravelerDto[];
}
