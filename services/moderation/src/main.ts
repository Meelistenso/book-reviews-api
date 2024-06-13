import { MODERATION_SERVICE } from '@app/common/microservices/constants';
import { getConsumerConfig } from '@app/common/microservices/kafka';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ModerationModule } from 'services/moderation/src/moderation.module';

import { start } from '@google-cloud/trace-agent';
start();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ModerationModule,
    getConsumerConfig(MODERATION_SERVICE),
  );

  app.useLogger(app.get(Logger));

  app.listen();
}
bootstrap();
