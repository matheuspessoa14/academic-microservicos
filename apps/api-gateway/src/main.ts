import {
  ValidationPipe,
} from '@nestjs/common';

import {
  NestFactory,
} from '@nestjs/core';

import { AppModule } from './app.module';

import {
  RpcToHttpExceptionFilter,
} from './rpc-to-http-exception.filter';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new RpcToHttpExceptionFilter(),
  );

  await app.listen(3000);
}

bootstrap();