import { AUTH_SERVICE } from '@app/common/microservices/constants';
import { getConsumerConfig } from '@app/common/microservices/kafka';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

import { start } from '@google-cloud/trace-agent';
start();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    getConsumerConfig(AUTH_SERVICE),
  );

  app.useLogger(app.get(Logger));

  app.listen();
}
bootstrap();
