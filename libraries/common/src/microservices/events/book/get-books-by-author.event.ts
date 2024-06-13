import { BookEventType } from '../../constants/events';
import { Book } from '@app/repositories';

export class GetBooksByAuthorEvent {
  readonly _type = BookEventType.GetBooksByAuthor;

  constructor(public readonly author: string | string[]) {}

  toString() {
    return JSON.stringify({
      author: this.author,
    });
  }
}

export class GetBooksByAuthorEventResponse {
  readonly _type = BookEventType.GetBooksByAuthor;

  constructor(public readonly books: Book[]) {}

  toString() {
    return JSON.stringify({
      books: this.books,
    });
  }
}
