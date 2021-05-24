import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ElectionOptionORM } from './election-option-orm';

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
}
