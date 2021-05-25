import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDatabase } from './database/typeorm-config';
import { CardanoProvider } from './blockchain/cardano';
import { NodeMailerProvider } from './emails/node-mailer';
import { Ballot } from './domain/entities/ballot';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  await connectDatabase();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

async function testCardano() {
  await new CardanoProvider().test();
}

async function testEmails() {
  const email = process.env.TEST_EMAIL_RECEIVE_ADDRESS;
  await new NodeMailerProvider().sendFailProcessingVoteEmail(
    email,
  );
  await new NodeMailerProvider().sendProcessingVoteEmail(
    email,
  );
  const ballot = new Ballot(null, null);
  ballot.permanentId = process.env.TESTNET_DUMMY_ADA_TRANSACTION;
  await new NodeMailerProvider().sendSuccessfulVoteEmail(
    email,
    ballot,
  );
}

bootstrap();
