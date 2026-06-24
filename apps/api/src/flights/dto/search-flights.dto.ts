import { IsDateString, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class SearchFlightsDto {
  @Matches(/^[A-Za-z]{3}$/)
  origin!: string;

  @Matches(/^[A-Za-z]{3}$/)
  destination!: string;

  @IsDateString()
  departureDate!: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsInt()
  @Min(1)
  @Max(9)
  adults!: number;
}
