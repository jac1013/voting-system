import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoterORM } from './voter-orm';

@Entity({ name: 'user' })
export class UserORM {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email: string;

  @OneToOne(() => VoterORM)
  @JoinColumn()
  voter?: VoterORM;
}
