import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // 🔥 AUMENTAR LÍMITE
  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }));

 app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

  // 🔥 CORS
  app.enableCors({
  origin: [
    "https://proyectofinal-1-qzvx.onrender.com",
    "http://localhost:5173",
  ],
  credentials: true,
});

await app.listen(process.env.PORT || 3000);
}

bootstrap();