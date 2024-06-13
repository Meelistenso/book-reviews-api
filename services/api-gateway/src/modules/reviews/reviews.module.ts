import { JwtAuthGuard } from '@app/common';
import {
  AUTH_SERVICE,
  REVIEW_SERVICE,
} from '@app/common/microservices/constants';
import { getClientConfig } from '@app/common/microservices/kafka';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CreateReviewSagaModule } from './sagas/create-review/create-review-saga.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      getClientConfig(AUTH_SERVICE, ReviewsModule.name + '_'),
      getClientConfig(REVIEW_SERVICE, ReviewsModule.name + '_'),
    ]),
    CreateReviewSagaModule,
  ],
  controllers: [ReviewsController],
  providers: [JwtAuthGuard, ReviewsService],
})
export class ReviewsModule {}
