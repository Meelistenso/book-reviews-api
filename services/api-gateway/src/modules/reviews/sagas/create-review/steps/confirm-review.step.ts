import {
  REVIEW_SERVICE,
  ReviewEventType,
} from '@app/common/microservices/constants';
import {
  UpdateReviewEvent,
  UpdateReviewEventResponse,
} from '@app/common/microservices/events/review';
import { Step } from '@app/common/microservices/transactions';
import { Review } from '@app/repositories';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ConfirmReviewStep
  extends Step<Review, Review>
  implements OnModuleInit
{
  private readonly logger = new Logger(ConfirmReviewStep.name);

  constructor(
    @Inject(REVIEW_SERVICE)
    private reviewClient: ClientKafka,
  ) {
    super();
    this.name = 'Confirm Review Step';
  }

  async onModuleInit() {
    this.logger.log(
      `Subscribing to response of ${ReviewEventType.UpdateReview}`,
    );
    this.reviewClient.subscribeToResponseOf(ReviewEventType.UpdateReview);
  }

  async invoke(review: Review): Promise<Review> {
    const event = new UpdateReviewEvent(
      review.id,
      review.title,
      review.text,
      review.score,
      'confirmed',
    );

    const updateResult = await lastValueFrom(
      this.reviewClient.send<UpdateReviewEventResponse>(event._type, event),
    );

    this.logger.log('Review confirmed');
    return updateResult.review;
  }

  async withCompensation(review: Review): Promise<Review> {
    return Promise.resolve(review);
  }
}
