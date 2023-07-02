import { User } from '../users/user.entity';
import { Promise, PromiseStatus } from './promise.entity';

export enum PromiseEmitterType {
  CREATE = 'prommise.create',
  UPDATE = 'prommise.update',
}

export class PromiseEvent {
  public readonly id: string;
  public readonly title: string;
  public readonly to: UserEvent;
  public readonly from: UserEvent;
  public readonly status: PromiseStatus;
  public readonly createdAt: Date;

  constructor(private readonly promise: Promise) {
    this.id = this.promise.id;
    this.title = this.promise.title;
    this.to = this.createUserEvent(this.promise.to);
    this.from = this.createUserEvent(this.promise.from);
    this.status = this.promise.status;
    this.createdAt = this.promise.createdAt;
  }

  private createUserEvent(user: User): UserEvent {
    return {
      id: user.id,
      fullName: `${user.firstName} + ${user.lastName}`,
      email: user.email,
    };
  }
}

type UserEvent = {
  id: string;
  fullName: string;
  email: string;
};
