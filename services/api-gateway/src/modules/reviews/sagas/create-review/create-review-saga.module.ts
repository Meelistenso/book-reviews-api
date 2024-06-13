import {
  AUTH_SERVICE,
  BOOK_SERVICE,
  MODERATION_SERVICE,
  REVIEW_SERVICE,
} from '@app/common/microservices/constants';
import { getClientConfig } from '@app/common/microservices/kafka';
import { CreateReviewSaga } from './create-review.saga';
import { CheckReviewStep } from './steps/check-review.step';
import { ConfirmReviewStep } from './steps/confirm-review.step';
import { IncreaseKarmaStep } from './steps/increase-karma.step';
import { PlaceReviewStep } from './steps/place-review.step';
import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      getClientConfig(BOOK_SERVICE, CreateReviewSagaModule.name + '_'),
      getClientConfig(AUTH_SERVICE, CreateReviewSagaModule.name + '_'),
      getClientConfig(REVIEW_SERVICE, CreateReviewSagaModule.name + '_'),
      getClientConfig(MODERATION_SERVICE, CreateReviewSagaModule.name + '_'),
    ]),
  ],
  providers: [
    {
      provide: 'place-review-step',
      useClass: PlaceReviewStep,
    },
    {
      provide: 'check-review-step',
      useClass: CheckReviewStep,
    },
    {
      provide: 'confirm-review-step',
      useClass: ConfirmReviewStep,
    },
    {
      provide: 'increase-carma-step',
      useClass: IncreaseKarmaStep,
    },
    CreateReviewSaga,
  ],
  exports: [CreateReviewSaga],
})
export class CreateReviewSagaModule {}
