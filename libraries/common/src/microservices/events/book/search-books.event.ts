import { BookEventType } from '../../constants/events';
import { Book } from '@app/repositories';

export class SearchBooksEvent {
  readonly _type = BookEventType.SearchBooks;

  constructor(public readonly search: string) {}

  toString() {
    return JSON.stringify({
      search: this.search,
    });
  }
}

export class SearchBooksEventResponse {
  readonly _type = BookEventType.SearchBooks;

  constructor(public readonly books: Book[]) {}

  toString() {
    return JSON.stringify({
      books: this.books,
    });
  }
}
