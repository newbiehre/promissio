import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promise, PromiseStatus } from './promise.entity';
import { User } from './user.entity';

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

  @ManyToOne(() => User, (user) => user.logs, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  executedBy: User;

  @Column({ default: new Date() })
  createdAt: Date;
}
