import {
  CreateBookEventResponse,
  SearchBooksEventResponse,
  GetPopularBooksEventResponse,
  GetBookByIdEventResponse,
  UpdateBookEventResponse,
  DeleteBookEventResponse,
  GetBooksByAuthorEventResponse,
  SynchronizeSearchIndexEventResponse,
  RefreshPopularBooksEventResponse,
} from '../../../events/book';

export type BookEventResponse =
  | CreateBookEventResponse
  | UpdateBookEventResponse
  | GetBooksByAuthorEventResponse
  | SearchBooksEventResponse
  | GetBookByIdEventResponse
  | GetPopularBooksEventResponse
  | DeleteBookEventResponse
  | SynchronizeSearchIndexEventResponse
  | RefreshPopularBooksEventResponse;
