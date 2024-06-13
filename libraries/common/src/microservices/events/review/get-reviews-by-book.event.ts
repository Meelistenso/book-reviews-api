import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class GetReviewsByBookEvent {
  readonly _type = ReviewEventType.GetReviewsByBook;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class GetReviewsByBookEventResponse {
  readonly _type = ReviewEventType.GetReviewsByBook;

  constructor(public readonly reviews: Review[]) {}

  toString() {
    return JSON.stringify({
      reviews: this.reviews,
    });
  }
}
