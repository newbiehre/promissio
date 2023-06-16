import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PromiseLog } from '../promise-logs/promise-log.entity';
import { Promise } from '../promise/promise.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isApproved: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Promise, (promise) => promise.from, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  myPromises: Promise[];

  @OneToMany(() => Promise, (promise) => promise.from, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  othersPromises: Promise[];

  @OneToMany(() => PromiseLog, (log) => log.executedBy)
  logs: PromiseLog[];
}
