import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PromiseStatus } from 'src/app/promises/promise.entity';

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

export class FilterPromiseDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  toUserId?: string;

  @IsString()
  @IsOptional()
  fromUserId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  ocassion?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
