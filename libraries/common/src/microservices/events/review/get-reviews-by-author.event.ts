import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class GetReviewsByAuthorEvent {
  readonly _type = ReviewEventType.GetReviewsByAuthor;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class GetReviewsByAuthorEventResponse {
  readonly _type = ReviewEventType.GetReviewsByAuthor;

  constructor(public readonly reviews: Review[]) {}

  toString() {
    return JSON.stringify({
      reviews: this.reviews,
    });
  }
}
