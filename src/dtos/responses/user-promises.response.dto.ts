import { Expose } from 'class-transformer';

export class UserPromisesDto {
  @Expose()
  myPromises: {
    count: PromiseCount;
    promises: ToUserPromise[];
  };
  @Expose()
  othersPromises: {
    count: PromiseCount;
    promises: FromUserPromise[];
  };
}

export class PromiseCount {
  totalCount: number;
  issuedCount: number;
  approvedCount: number;
  redeemdCount: number;
  rejectedCount: number;
  expiredCount: number;
}

export abstract class PromiseDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class UserShortInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export class ToUserPromise extends PromiseDetails {
  to: UserShortInfo;
}

export class FromUserPromise extends PromiseDetails {
  from: UserShortInfo;
}
