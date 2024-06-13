import { HealthModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { BooksModule } from './modules/books/books.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    HealthModule,
    ReviewsModule,
    BooksModule,
    WebhookModule,
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
        WEBHOOK_API_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
