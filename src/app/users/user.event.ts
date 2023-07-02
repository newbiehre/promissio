import { User } from './user.entity';

export enum UserEmitterType {
  UPDATE = 'user.update',
  APPROVE_BY_ADMIN = 'user.approveByAdmin',
}

export class UserEvent {
  public readonly id: string;
  public readonly fullName: string;
  public readonly email: string;

  constructor(private readonly user: User) {
    this.id = this.user.id;
    this.fullName = `${this.user.firstName} ${this.user.lastName}`;
    this.email = this.user.email;
  }
}
