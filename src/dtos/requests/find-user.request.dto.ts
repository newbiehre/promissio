import { IsString } from 'class-validator';

export class FindUserDto {
  @IsString()
  email: string;
}
