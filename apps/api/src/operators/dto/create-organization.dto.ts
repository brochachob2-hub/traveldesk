import { IsEmail, IsHexColor, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must use lowercase letters, numbers, and hyphens' })
  @MaxLength(60)
  slug!: string;

  @IsOptional()
  @IsHexColor()
  brandColor?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsPhoneNumber('PH')
  supportPhone?: string;
}
