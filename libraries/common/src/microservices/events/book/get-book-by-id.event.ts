import { BookEventType } from '../../constants/events';
import { Book } from '@app/repositories';

export class GetBookByIdEvent {
  readonly _type = BookEventType.GetBookById;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class GetBookByIdEventResponse {
  readonly _type = BookEventType.GetBookById;

  constructor(public readonly book: Book) {}

  toString() {
    return JSON.stringify({
      book: this.book,
    });
  }
}
