import { Expose } from 'class-transformer';

export class UserAccountDto {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  email: string;
  @Expose()
  isApproved: boolean;
}
