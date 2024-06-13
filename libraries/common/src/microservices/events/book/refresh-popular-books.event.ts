import { BookEventType } from '../../constants/events';
import { TopBook } from '@app/repositories';

export class RefreshPopularBooksEvent {
  readonly _type = BookEventType.RefreshPopularBooks;

  constructor() {}

  toString() {
    return JSON.stringify({});
  }
}

export class RefreshPopularBooksEventResponse {
  readonly _type = BookEventType.RefreshPopularBooks;

  constructor(public readonly books: TopBook[]) {}

  toString() {
    return JSON.stringify({
      books: this.books,
    });
  }
}
