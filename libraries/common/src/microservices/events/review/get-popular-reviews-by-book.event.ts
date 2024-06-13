import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class GetPopularReviewsByBookEvent {
  readonly _type = ReviewEventType.GetPopularReviewsByBook;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class GetPopularReviewsByBookEventResponse {
  readonly _type = ReviewEventType.GetPopularReviewsByBook;

  constructor(public readonly reviews: Review[]) {}

  toString() {
    return JSON.stringify({
      reviews: this.reviews,
    });
  }
}
