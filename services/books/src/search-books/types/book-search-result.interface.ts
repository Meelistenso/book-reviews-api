import { BookSearchBody } from 'services/books/src/search-books/types/book-search-body.interface';

export interface BookSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: BookSearchBody;
    }>;
  };
}
