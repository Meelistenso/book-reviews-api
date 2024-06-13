import {
  AUTH_SERVICE,
  BOOK_SERVICE,
} from '@app/common/microservices/constants';
import { getClientConfig } from '@app/common/microservices/kafka';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { ReviewFeedModule } from './feed/feed.module';

@Module({
  imports: [
    ReviewFeedModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        KAFKA_BROKERCONNECT: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      getClientConfig(AUTH_SERVICE, AppModule.name + '_'),
      getClientConfig(BOOK_SERVICE, AppModule.name + '_'),
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
