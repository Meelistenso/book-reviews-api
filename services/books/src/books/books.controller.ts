import { BookEventType } from '@app/common/microservices/constants';
import {
  CreateBookEvent,
  CreateBookEventResponse,
  DeleteBookEvent,
  DeleteBookEventResponse,
  GetPopularBooksEvent,
  GetPopularBooksEventResponse,
  GetBookByIdEvent,
  GetBookByIdEventResponse,
  GetBooksByAuthorEvent,
  GetBooksByAuthorEventResponse,
  SearchBooksEvent,
  SearchBooksEventResponse,
  UpdateBookEvent,
  UpdateBookEventResponse,
  SynchronizeSearchIndexEvent,
  SynchronizeSearchIndexEventResponse,
  RefreshPopularBooksEvent,
  RefreshPopularBooksEventResponse,
} from '@app/common/microservices/events/book';
import { BookEventHandlerController } from '@app/common/microservices/types/events/book';
import { Book } from '@app/repositories';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BooksService } from './books.service';

@Controller()
export class BooksController implements BookEventHandlerController {
  constructor(private readonly booksService: BooksService) {}

  @MessagePattern(BookEventType.CreateBook)
  async handleCreateBook(
    payload: CreateBookEvent,
  ): Promise<CreateBookEventResponse> {
    const book = await this.booksService.createBook(payload);
    return new CreateBookEventResponse(book);
  }

  @MessagePattern(BookEventType.UpdateBook)
  async handleUpdateBook(payload: UpdateBookEvent) {
    const updateResult = await this.booksService.updateBook(payload);

    let book: Book;

    if (updateResult.affected) {
      book = await this.booksService.getById(payload.id);
    }

    return new UpdateBookEventResponse(book);
  }

  @MessagePattern(BookEventType.GetBooksByAuthor)
  async handleGetBooksByAuthor(payload: GetBooksByAuthorEvent) {
    const book = await this.booksService.getByAuthor({
      authors:
        typeof payload.author === 'string' ? [payload.author] : payload.author,
    });

    return new GetBooksByAuthorEventResponse(book);
  }

  @MessagePattern(BookEventType.SearchBooks)
  async handleSearchBooks({ search }: SearchBooksEvent) {
    const books = await this.booksService.searchBooksEfficiently(search);

    return new SearchBooksEventResponse(books);
  }

  @MessagePattern(BookEventType.GetBookById)
  async handleGetBookById(payload: GetBookByIdEvent) {
    const book = await this.booksService.getById(payload.id);

    return new GetBookByIdEventResponse(book);
  }

  @MessagePattern(BookEventType.GetPopularBooks)
  async handleGetPopularBooks(_: GetPopularBooksEvent) {
    const books = await this.booksService.getPopularBooks();

    return new GetPopularBooksEventResponse(books);
  }

  @MessagePattern(BookEventType.RefreshPopularBooks)
  async handleRefreshPopularBooks(_: RefreshPopularBooksEvent) {
    const books = await this.booksService.refreshPopularBooks();

    return new RefreshPopularBooksEventResponse(books);
  }

  @MessagePattern(BookEventType.DeleteBook)
  async handleDeleteBook({ id }: DeleteBookEvent) {
    const deleteResult = await this.booksService.deleteBook(id);

    if (!deleteResult.affected) {
      return new DeleteBookEventResponse();
    }

    return new DeleteBookEventResponse(id);
  }

  @MessagePattern(BookEventType.SynchronizeSearchIndex)
  async handleSynchronizeSearchIndex(_: SynchronizeSearchIndexEvent) {
    const indexSize = await this.booksService.synchronizeSearchIndex();

    return new SynchronizeSearchIndexEventResponse(indexSize);
  }
}
