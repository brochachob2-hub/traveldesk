import { ProductStatus } from '@traveldesk/database';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(140)
  name?: string;

  @IsOptional() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) @MaxLength(80)
  slug?: string;

  @IsOptional() @IsString() @MinLength(10) @MaxLength(300)
  summary?: string;

  @IsOptional() @IsString() @MinLength(30) @MaxLength(10000)
  description?: string;

  @IsOptional() @IsString() @MaxLength(140)
  destination?: string;

  @IsOptional() @IsInt() @Min(1) @Max(365)
  durationDays?: number;

  @IsOptional() @IsUrl({ require_protocol: true })
  coverImageUrl?: string;

  @IsOptional() @IsEnum(ProductStatus)
  status?: ProductStatus;
}
