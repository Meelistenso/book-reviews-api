import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class GetReviewByIdEvent {
  readonly _type = ReviewEventType.GetReviewById;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class GetReviewByIdEventResponse {
  readonly _type = ReviewEventType.GetReviewById;

  constructor(public readonly review: Review) {}

  toString() {
    return JSON.stringify({
      review: this.review,
    });
  }
}
