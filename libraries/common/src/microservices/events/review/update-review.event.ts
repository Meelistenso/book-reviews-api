import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class UpdateReviewEvent {
  readonly _type = ReviewEventType.UpdateReview;

  constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly text?: string,
    public readonly score?: number,
    public readonly status?: string,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      text: this.text,
      score: this.score,
    });
  }
}

export class UpdateReviewEventResponse {
  readonly _type = ReviewEventType.UpdateReview;

  constructor(public readonly review?: Review) {}

  toString() {
    return JSON.stringify({
      review: this.review,
    });
  }
}
