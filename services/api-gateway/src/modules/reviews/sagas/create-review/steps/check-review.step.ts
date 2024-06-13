import {
  MODERATION_SERVICE,
  ModerationEventType,
  REVIEW_SERVICE,
  ReviewEventType,
} from '@app/common/microservices/constants';
import {
  CheckTextEvent,
  CheckTextEventResponse,
} from '@app/common/microservices/events/moderation';
import {
  UpdateReviewEvent,
  UpdateReviewEventResponse,
} from '@app/common/microservices/events/review';
import { Step } from '@app/common/microservices/transactions';
import { Review } from '@app/repositories';
import { ModerationFailedError } from '../exceptions/moderation-failed.error';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CheckReviewStep
  extends Step<Review, Review>
  implements OnModuleInit
{
  private readonly logger = new Logger(CheckReviewStep.name);
  constructor(
    @Inject(REVIEW_SERVICE)
    private reviewClient: ClientKafka,
    @Inject(MODERATION_SERVICE)
    private moderationClient: ClientKafka,
  ) {
    super();
    this.name = 'Check Review Text Step';
  }

  async onModuleInit() {
    this.logger.log(
      `Subscribing to response of ${ModerationEventType.CheckText}`,
    );
    this.moderationClient.subscribeToResponseOf(ModerationEventType.CheckText);

    this.logger.log(
      `Subscribing to response of ${ReviewEventType.UpdateReview}`,
    );
    this.reviewClient.subscribeToResponseOf(ReviewEventType.UpdateReview);

    this.logger.log(
      `Subscribing to response of ${ReviewEventType.DeleteReview}`,
    );
    this.reviewClient.subscribeToResponseOf(ReviewEventType.DeleteReview);
  }

  async invoke(review: Review): Promise<Review> {
    const event = new CheckTextEvent(review.text);
    this.logger.log(`Checking review text: ${event.toString()}`);
    const moderationResult: CheckTextEventResponse = await lastValueFrom(
      this.moderationClient.send(event._type, event),
    );

    if (!moderationResult.isAcceptable) {
      throw new ModerationFailedError(
        `Review text is not acceptable: ${review.text}`,
      );
    }
    this.logger.log('Review text is acceptable');

    return review;
  }

  async withCompensation(review: Review): Promise<Review> {
    const event = new UpdateReviewEvent(
      review.id,
      review.title,
      review.text,
      review.score,
      'cancelled',
    );
    const updateResult = await lastValueFrom(
      this.reviewClient.send<UpdateReviewEventResponse>(event._type, event),
    );

    return updateResult.review;
  }
}
