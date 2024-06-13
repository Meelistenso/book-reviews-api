import {
  REVIEW_SERVICE,
  ReviewEventType,
} from '@app/common/microservices/constants';
import {
  CreateReviewEvent,
  CreateReviewEventResponse,
  DeleteReviewEvent,
} from '@app/common/microservices/events/review';
import { Step } from '@app/common/microservices/transactions';
import { Review } from '@app/repositories';
import { CreatingFailedError } from '../exceptions/creating-failed.error';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PlaceReviewStep
  extends Step<Review, Review>
  implements OnModuleInit
{
  private readonly logger = new Logger(PlaceReviewStep.name);

  constructor(
    @Inject(REVIEW_SERVICE)
    private reviewClient: ClientKafka,
  ) {
    super();
    this.name = 'Place Review Step';
  }

  async onModuleInit() {
    this.logger.log(
      `Subscribing to response of ${ReviewEventType.CreateReview}`,
    );
    this.reviewClient.subscribeToResponseOf(ReviewEventType.CreateReview);
  }

  async invoke(review: Review): Promise<Review> {
    const event = new CreateReviewEvent(
      review.authorId,
      review.bookId,
      review.title,
      review.text,
      review.score,
    );
    const saveResult: CreateReviewEventResponse = await lastValueFrom(
      this.reviewClient.send(event._type, event),
    );

    if (!saveResult.review) {
      throw new CreatingFailedError(`Review creation failed`);
    }

    this.logger.log('Review created');
    return saveResult.review;
  }

  async withCompensation(review: Review): Promise<Review> {
    const event = new DeleteReviewEvent(review.id);
    await lastValueFrom(this.reviewClient.send(event._type, event));
    this.logger.log('Review deleted');
    return review;
  }
}
