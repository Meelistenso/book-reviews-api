import { ReviewEventType } from '../../constants/events';
import { Reaction } from '@app/repositories';

export class ReactToReviewEvent {
  readonly _type = ReviewEventType.ReactToReview;
  constructor(
    public readonly reactedById: number,
    public readonly isLike: boolean,
    public readonly reviewId: number,
  ) {}

  toString() {
    return JSON.stringify({
      reactedById: this.reactedById,
      isLike: this.isLike,
      reviewId: this.reviewId,
    });
  }
}

export class ReactToReviewEventResponse {
  readonly _type = ReviewEventType.ReactToReview;
  constructor(public readonly reaction: Reaction) {}

  toString() {
    return JSON.stringify({
      reaction: this.reaction,
    });
  }
}
