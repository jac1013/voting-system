import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ElectionORM } from './election-orm';
import { BallotORM } from './ballot-orm';

@Entity()
export class ElectionOptionORM {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  choiceId: number;

  @Column()
  title: string;

  @ManyToOne(() => ElectionORM, (e) => e.options)
  election: ElectionORM;

  @OneToMany(() => BallotORM, (b) => b.option)
  ballots: BallotORM;
}
