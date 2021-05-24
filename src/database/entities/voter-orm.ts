import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserORM } from './user-orm';

@Entity({ name: 'voter' })
export class VoterORM {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nationalId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => UserORM)
  user: UserORM;
}
