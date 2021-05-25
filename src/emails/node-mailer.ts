import { EmailProvider } from '../domain/providers/email-provider';
import { Ballot } from '../domain/entities/ballot';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import * as nodemailer from 'nodemailer';

export class NodeMailerProvider implements EmailProvider {
  private transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendFailProcessingVoteEmail(email: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Joseph Arrieta" <${process.env.SMTP_FROM_EMAIL}`,
      to: email,
      subject: 'Vote request failed. Please try again',
      text: `Your vote request failed, for this reason your vote was not created and we encourage you to please try again.`,
    });
  }

  async sendProcessingVoteEmail(email: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Joseph Arrieta" <${process.env.SMTP_FROM_EMAIL}`,
      to: email,
      subject: 'Vote is processing.',
      text: `Vote is being processed in our system, we will let you know when it's ready so you can verify it.`,
    });
  }

  async sendSuccessfulVoteEmail(email: string, ballot: Ballot): Promise<void> {
    await this.transporter.sendMail({
      from: `"Joseph Arrieta" <${process.env.SMTP_FROM_EMAIL}`,
      to: email,
      subject: 'Vote successfully processed',
      text: `Your vote was successfully processed. For checking it out you can go here and see the transaction for yourself
       ${process.env.CARDANO_EXPLORER_URL}${ballot.permanentId}`,
    });
  }
}
