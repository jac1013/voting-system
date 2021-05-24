import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Voter } from '../../domain/entities/voter';
import { ElectionOptionORM } from './election-option-orm';

@Entity({ name: 'ballot' })
export class BallotORM {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  created: string;

  @ManyToOne(() => ElectionOptionORM, (e) => e.ballots)
  option: ElectionOptionORM;

  @Column()
  permanentId?: string;

  voter: Voter;
}
