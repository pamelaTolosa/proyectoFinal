import { Module } from '@nestjs/common';
import { AppController } from './usuario.controller';
import { AppService } from './usuario.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
