export const BookEventType = {
  CreateBook: 'create_book',
  DeleteBook: 'delete_book',
  GetBookById: 'get_book_by_id',
  GetBooksByAuthor: 'get_books_by_author',
  GetPopularBooks: 'get_popular_books',
  RefreshPopularBooks: 'refresh_popular_books',
  SearchBooks: 'search_books',
  UpdateBook: 'update_book',
  SynchronizeSearchIndex: 'synchronize_book_search_index',
} as const;
