import { ReviewEventType } from '../../constants/events';

export class DeleteReviewEvent {
  readonly _type = ReviewEventType.DeleteReview;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class DeleteReviewEventResponse {
  readonly _type = ReviewEventType.DeleteReview;

  constructor(public readonly id?: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}
