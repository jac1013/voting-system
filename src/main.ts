import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDatabase } from './database/typeorm-config';

async function bootstrap() {
  await connectDatabase();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
