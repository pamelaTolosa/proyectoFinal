import { NestFactory } from '@nestjs/core';
import {DatabaseModule} from './database/database.module';
import { AppModule } from './app.module';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();