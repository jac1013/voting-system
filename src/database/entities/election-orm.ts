import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ElectionOptionORM } from './election-option-orm';
import { BallotORM } from './ballot-orm';
import { VoterORM } from './voter-orm';

@Entity({ name: 'election' })
export class ElectionORM {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  isActive: boolean;

  @OneToMany(() => ElectionOptionORM, (e) => e.election)
  options: ElectionOptionORM[];

  @Column()
  startedDate: string;

  @Column()
  endedDate: string;

  @OneToMany(() => BallotORM, (b) => b.election)
  ballots: BallotORM;

  @ManyToMany(() => VoterORM)
  @JoinTable()
  voters: VoterORM[];
}
