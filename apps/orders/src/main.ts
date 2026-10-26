import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

import {
  HttpToRpcExceptionFilter,
} from '@app/contracts';

import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      OrdersModule,
      {
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3002,
        },
      },
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new HttpToRpcExceptionFilter(),
  );

  await app.listen();
}

bootstrap();