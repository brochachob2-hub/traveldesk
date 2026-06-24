import { IsInt, IsOptional, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name!: string;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(80)
  slug!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(300)
  summary!: string;

  @IsString()
  @MinLength(30)
  @MaxLength(10000)
  description!: string;

  @IsString()
  @MaxLength(140)
  destination!: string;

  @IsInt()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  coverImageUrl?: string;
}
