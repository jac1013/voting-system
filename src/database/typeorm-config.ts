import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
    entities: [],
  } as PostgresConnectionOptions);
}
