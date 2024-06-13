import { BookEventType } from '../../constants/events';
import { TopBook } from '@app/repositories';

export class GetPopularBooksEvent {
  readonly _type = BookEventType.GetPopularBooks;

  constructor() {}

  toString() {
    return JSON.stringify({});
  }
}

export class GetPopularBooksEventResponse {
  readonly _type = BookEventType.GetPopularBooks;

  constructor(public readonly books: TopBook[]) {}

  toString() {
    return JSON.stringify({
      books: this.books,
    });
  }
}
