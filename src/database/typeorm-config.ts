import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { BallotORM } from './entities/ballot-orm';
import { ElectionORM } from './entities/election-orm';
import { UserORM } from './entities/user-orm';
import { VoterORM } from './entities/voter-orm';
import { ElectionOptionORM } from './entities/election-option-orm';

export async function connectDatabase() {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'vote_system',
    synchronize: true,
    logging: false,
    entities: [ElectionORM, UserORM, VoterORM, ElectionOptionORM, BallotORM],
  } as PostgresConnectionOptions);
}
