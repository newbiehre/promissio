import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequiredIfNotNull } from '../utils/required-if-not-null.decorator';

export class SigninDto {
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

  // @Match('password', { message: 'Confirmed password does not match.' })
  // confirmPassword: string;
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
