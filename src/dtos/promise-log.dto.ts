import { IsEnum, IsNotEmpty } from 'class-validator';
import { Promise, PromiseStatus } from 'src/entities/promise.entity';
import { User } from 'src/entities/user.entity';

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
