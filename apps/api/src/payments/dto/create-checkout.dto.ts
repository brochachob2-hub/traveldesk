import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @MinLength(32)
  @MaxLength(200)
  bookingAccessToken!: string;
}
