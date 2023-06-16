import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PromiseLog } from './promise-log.entity';
import { User } from './user.entity';

export enum PromiseStatus {
  ISSUED = 'ISSUED',
  APPROVED = 'APPROVED',
  REDEEMED = 'REDEEMED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity()
export class Promise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  to: User;

  @ManyToOne(() => User, (user) => user.id)
  from: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  ocassion: string;

  @Column({ enum: PromiseStatus, default: PromiseStatus.ISSUED })
  status: PromiseStatus;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToMany(() => PromiseLog, (logs) => logs.promise)
  logs: PromiseLog;
}
