import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  console.log("🚀 VERSION DEBUG LOGIN");
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

  app.enableCors({
    origin:true,
    credentials: true,
  });
console.log('CORS CONFIGURADO PARA RENDER');

  await app.listen(process.env.PORT || 3000);
}

bootstrap();