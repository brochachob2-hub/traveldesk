import { IsString, MinLength } from 'class-validator';

export class FederatedLoginDto {
  @IsString()
  @MinLength(20)
  idToken!: string;
}
