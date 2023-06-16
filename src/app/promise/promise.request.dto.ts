import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PromiseStatus } from 'src/app/promise/promise.entity';

export class CreatePromiseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ocassion: string;
}

export class UpdatePromiseDto {
  @IsNotEmpty()
  @IsEnum(PromiseStatus)
  @Transform((params) => PromiseStatus[params.value])
  status: PromiseStatus;
}
