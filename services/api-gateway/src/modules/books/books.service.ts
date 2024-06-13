import {
  AuthEventType,
  BookEventType,
  AUTH_SERVICE,
  BOOK_SERVICE,
} from '@app/common/microservices/constants';
import {
  CreateBookEvent,
  CreateBookEventResponse,
  DeleteBookEvent,
  DeleteBookEventResponse,
  GetBookByIdEvent,
  GetBookByIdEventResponse,
  GetBooksByAuthorEvent,
  GetBooksByAuthorEventResponse,
  UpdateBookEvent,
  UpdateBookEventResponse,
  SearchBooksEvent,
  SearchBooksEventResponse,
  GetPopularBooksEvent,
  GetPopularBooksEventResponse,
  SynchronizeSearchIndexEvent,
  SynchronizeSearchIndexEventResponse,
} from '@app/common/microservices/events/book';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateBookDto, UpdateBookDto } from './dto/requests';

@Injectable()
export class BooksService implements OnModuleInit {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @Inject(BOOK_SERVICE)
    private readonly bookClient: ClientKafka,
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.logger.log(`Subscribing to response of ${AuthEventType.Authenticate}`);
    this.authClient.subscribeToResponseOf(AuthEventType.Authenticate);

    for (const eventType of Object.values(BookEventType)) {
      this.logger.log(`Subscribing to response of ${eventType}`);
      this.bookClient.subscribeToResponseOf(eventType);
    }
  }

  create({
    image,
    title,
    description,
    authors,
    publisher,
    publishedDate,
    previewLink,
  }: CreateBookDto) {
    this.logger.log('GATEWAY - Calling Book Service');

    const event = new CreateBookEvent(
      title,
      authors,
      publisher,
      publishedDate,
      description,
      image,
      previewLink,
    );

    return this.bookClient.send(event._type, event).pipe(
      map(({ book }: CreateBookEventResponse) => {
        if (!book) {
          this.logger.log('GATEWAY - Book creation failed');

          throw new BadRequestException('Book already exists');
        }

        this.logger.log('GATEWAY - Book created successfully');
        return book;
      }),
    );
  }

  update({
    id,
    publishedDate,
    publisher,
    title,
    description,
    authors,
    previewLink,
    image,
  }: UpdateBookDto) {
    this.logger.log('GATEWAY - Calling Book Service');

    const updateEvent = new UpdateBookEvent(
      id,
      title,
      description,
      authors,
      publisher,
      publishedDate,
      image,
      previewLink,
    );

    return this.bookClient.send(updateEvent._type, updateEvent).pipe(
      map(({ book }: UpdateBookEventResponse) => {
        if (!book) {
          this.logger.log('GATEWAY - Book not found');

          throw new NotFoundException('Book not found');
        }

        this.logger.log('GATEWAY - Book updated successfully');
        return book;
      }),
    );
  }

  getById(id: number) {
    this.logger.log('GATEWAY - Calling Book Service');

    const event = new GetBookByIdEvent(id);

    return this.bookClient.send(event._type, event).pipe(
      map(({ book }: GetBookByIdEventResponse) => {
        if (!book) {
          this.logger.log('GATEWAY - Book not found');

          throw new NotFoundException('Book not found');
        }
        this.logger.log('GATEWAY - Book retrieved');
        return book;
      }),
    );
  }

  getByAuthor(author: string | string[]) {
    this.logger.log('GATEWAY - Calling Book Service');

    const event = new GetBooksByAuthorEvent(author);

    return this.bookClient.send(event._type, event).pipe(
      map(({ books }: GetBooksByAuthorEventResponse) => {
        this.logger.log('GATEWAY - Books retrieved');

        return books;
      }),
    );
  }

  searchBook(search: string) {
    this.logger.log('GATEWAY - Calling Book Service');

    const event = new SearchBooksEvent(search);

    return this.bookClient.send(event._type, event).pipe(
      map(({ books }: SearchBooksEventResponse) => {
        this.logger.log('GATEWAY - Books retrieved');

        return books;
      }),
    );
  }

  getPopular() {
    this.logger.log('GATEWAY - Calling Book Service');

    const event = new GetPopularBooksEvent();

    return this.bookClient.send(event._type, event).pipe(
      map(({ books }: GetPopularBooksEventResponse) => {
        this.logger.log('GATEWAY - Popular books retrieved');

        return books;
      }),
    );
  }

  delete(bookId: number) {
    this.logger.log('GATEWAY - Calling Book Service Delete Method');

    const deleteEvent = new DeleteBookEvent(bookId);

    return this.bookClient.send(deleteEvent._type, deleteEvent).pipe(
      map(({ id }: DeleteBookEventResponse) => {
        if (!id) {
          this.logger.log('GATEWAY - Book not found');
          throw new NotFoundException('Book not found');
        }

        this.logger.log('GATEWAY - Book deleted');
        return id;
      }),
    );
  }

  synchronizeSearchIndex() {
    this.logger.log('GATEWAY - Calling Book Service Synchronize Search Index');

    const event = new SynchronizeSearchIndexEvent();

    return this.bookClient.send(event._type, event).pipe(
      map(({ indexSize }: SynchronizeSearchIndexEventResponse) => {
        this.logger.log('GATEWAY - Search index synchronized');

        return indexSize;
      }),
    );
  }
}
