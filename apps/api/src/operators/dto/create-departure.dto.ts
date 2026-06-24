import { IsDateString, IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateDepartureDto {
  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsInt()
  @Min(1)
  @Max(10000)
  capacity!: number;

  @IsInt()
  @Min(0)
  priceMinor!: number;

  @IsString()
  @Length(3, 3)
  currency: string = 'PHP';
}
