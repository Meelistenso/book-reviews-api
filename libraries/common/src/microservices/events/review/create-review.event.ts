import { ReviewEventType } from '../../constants/events';
import { Review } from '@app/repositories';

export class CreateReviewEvent {
  readonly _type = ReviewEventType.CreateReview;

  constructor(
    public readonly authorId: number,
    public readonly bookId: number,
    public readonly title: string,
    public readonly text: string,
    public readonly score: number,
  ) {}

  toString() {
    return JSON.stringify({
      authorId: this.authorId,
      bookId: this.bookId,
      title: this.title,
      text: this.text,
      score: this.score,
    });
  }
}

export class CreateReviewEventResponse {
  readonly _type = ReviewEventType.CreateReview;

  constructor(public readonly review: Review) {}

  toString() {
    return JSON.stringify({
      review: this.review,
    });
  }
}
