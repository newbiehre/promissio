import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequiredIfNotNull } from '../utils/required-if-not-null.decorator';
import { User } from './user.entity';

export class UserLoggerDto {
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    delete this.password;
  }
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto extends SignupDto {
  @IsBoolean()
  @IsNotEmpty()
  makeAdmin: boolean;
}

export class FindUserDto {
  @IsString()
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @RequiredIfNotNull('newPassword')
  oldPassword?: string;

  @IsString()
  @RequiredIfNotNull('oldPassword')
  newPassword?: string;
}
