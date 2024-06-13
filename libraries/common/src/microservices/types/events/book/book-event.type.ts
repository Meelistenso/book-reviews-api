import {
  CreateBookEvent,
  DeleteBookEvent,
  GetBookByIdEvent,
  GetBooksByAuthorEvent,
  SearchBooksEvent,
  UpdateBookEvent,
  GetPopularBooksEvent,
  SynchronizeSearchIndexEvent,
  RefreshPopularBooksEvent,
} from '../../../events/book';

export type BookEvent =
  | CreateBookEvent
  | UpdateBookEvent
  | GetBooksByAuthorEvent
  | SearchBooksEvent
  | GetBookByIdEvent
  | GetPopularBooksEvent
  | DeleteBookEvent
  | SynchronizeSearchIndexEvent
  | RefreshPopularBooksEvent;
