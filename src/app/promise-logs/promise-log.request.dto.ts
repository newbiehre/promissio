import { IsEnum, IsNotEmpty } from 'class-validator';
import { Promise, PromiseStatus } from 'src/app/promises/promise.entity';
import { User } from '../users/user.entity';

export class CreatePromiseLogDto {
  @IsNotEmpty()
  promise: Promise;

  @IsEnum(PromiseStatus)
  @IsNotEmpty()
  status: PromiseStatus;

  @IsNotEmpty()
  executedBy: User;

  @IsNotEmpty()
  createdAt: Date;
}
