import { ReviewEventType } from '../../constants/events';

export class UnreactToReviewEvent {
  readonly _type = ReviewEventType.UnreactToReview;

  constructor(
    public readonly reactedById: number,
    public readonly reviewId: number,
  ) {}

  toString() {
    return JSON.stringify({
      reactedBy: this.reactedById,
      reviewId: this.reviewId,
    });
  }
}

export class UnreactToReviewEventResponse {
  readonly _type = ReviewEventType.UnreactToReview;

  constructor(
    public readonly reviewId?: number,
    public readonly reactedById?: number,
  ) {}

  toString() {
    return JSON.stringify({
      reviewId: this.reviewId,
      reactedById: this.reactedById,
    });
  }
}
