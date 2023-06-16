import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;
}

export class UserProtectedDto extends UserDto {
  @Expose()
  isApproved: boolean;
}

export class UserAdminProtectedDto extends UserProtectedDto {
  @Expose()
  isAdmin: boolean;
}
