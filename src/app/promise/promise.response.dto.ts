import { Expose, Transform, Type } from 'class-transformer';
import { PromiseStatus } from 'src/app/promise/promise.entity';
import { UserDto } from '../user/user.response.dto';

export class PromiseDto {
  @Expose()
  @Type(() => UserDto)
  to: UserDto;

  @Expose()
  @Type(() => UserDto)
  from: UserDto;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  ocassion: string;

  @Expose()
  @Transform((params) => PromiseStatus[params.value])
  status: PromiseStatus;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
