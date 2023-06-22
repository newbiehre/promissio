import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promise, PromiseStatus } from '../promises/promise.entity';
import { User } from '../users/user.entity';

@Entity()
export class PromiseLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Promise, (promise) => promise.logs, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  promise: Promise;

  @Column()
  status: PromiseStatus;

  @ManyToOne(() => User, (user) => user.promiseLogs, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  executedBy: User;

  @Column({ default: new Date() })
  createdAt: Date;
}
