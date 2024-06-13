import { Book, BooksRepository } from '@app/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { TopBooksService } from 'services/books/src/top-books/top-books.service';
import { SearchBooksService } from '../search-books/search-books.service';
import { ArrayContains, Raw } from 'typeorm';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly searchBooksService: SearchBooksService,
    private readonly topBooksService: TopBooksService,
  ) {}

  async createBook(
    payload: Pick<Book, 'title' | 'publisher' | 'publishedDate' | 'authors'> &
      Pick<Partial<Book>, 'previewLink' | 'description' | 'image'>,
  ) {
    this.logger.log('BOOK-SERVICE: Create book triggered');

    const newBook = new Book(payload);

    const createdBook = await this.booksRepository.create(newBook);

    this.logger.log('BOOK-SERVICE: Book created');

    this.searchBooksService.indexBook(createdBook);

    return createdBook;
  }

  async updateBook({
    id,
    ...payload
  }: Pick<Book, 'id'> &
    Pick<
      Partial<Book>,
      | 'previewLink'
      | 'description'
      | 'image'
      | 'authors'
      | 'title'
      | 'publishedDate'
      | 'publisher'
    >) {
    this.logger.log('BOOK-SERVICE: Update book triggered');

    const existingBook = await this.booksRepository.findOne({
      id,
    });

    if (existingBook) {
      const updateResult = await this.booksRepository.update(
        {
          id,
        },
        {
          ...payload,
          createdAt: existingBook.createdAt,
        },
      );
      await this.searchBooksService.update({ ...existingBook, ...payload });

      return updateResult;
    }
  }

  async getByAuthor(payload: Pick<Book, 'authors'>) {
    this.logger.log('BOOK-SERVICE: Get books by author triggered');

    return await this.booksRepository.find({
      authors: ArrayContains(payload.authors),
    });
  }

  async searchBooksByName(query: string) {
    this.logger.log('BOOK-SERVICE: Search books triggered');

    return await this.booksRepository.find({
      title: Raw((alias) => `${alias} ILIKE (:query)`, { query: `%${query}%` }),
    });
  }

  async searchBooksEfficiently(query: string) {
    this.logger.log('BOOK-SERVICE: Search books triggered');

    const hits = await this.searchBooksService.search(query);

    return this.booksRepository.findMany({
      where: {
        id: Raw((alias) => `${alias} IN (:...ids)`, {
          ids: hits.map((hit) => hit.id),
        }),
      },
    });
  }

  async refreshPopularBooks() {
    this.logger.log('BOOK-SERVICE: Refresh popular books triggered');

    await this.topBooksService.refreshTopBooks();

    return await this.getPopularBooks();
  }

  async getPopularBooks() {
    this.logger.log('BOOK-SERVICE: Get popular books triggered');

    return await this.topBooksService.getTopBooks();
  }

  async getById(id: Book['id']) {
    this.logger.log('BOOK-SERVICE: Get book by ID triggered');

    return await this.booksRepository.findOne({ id });
  }

  async deleteBook(id: Book['id']) {
    this.logger.log('BOOK-SERVICE: Delete book triggered');

    await this.searchBooksService.remove(id);

    return this.booksRepository.findOneAndDelete({ id });
  }

  async synchronizeSearchIndex() {
    this.logger.log('BOOK-SERVICE: Synchronize search index triggered');

    const indexExists = await this.searchBooksService.checkBooksIndexExists();
    this.logger.log('BOOK-SERVICE: Index exists: ' + indexExists);

    if (!indexExists) {
      await this.searchBooksService.createIndex();
    } else {
      await this.searchBooksService.clearFullIndex();
    }

    const batchSize = 300;
    let skip = 0;

    while (true) {
      this.logger.log(
        `BOOK-SERVICE: Synchronizing batch: ${Math.ceil(skip / batchSize) + 1}`,
      );

      const booksBatch = await this.booksRepository.findMany({
        skip: skip,
        take: batchSize,
      });

      if (booksBatch.length === 0) {
        break;
      }

      await this.searchBooksService.indexBooks(booksBatch);

      skip += batchSize;
    }

    this.logger.log('BOOK-SERVICE: Synchronize full index completed');
    const indexSize = await this.searchBooksService.getIndexCount();
    this.logger.log('BOOK-SERVICE: Indexed books count: ' + indexSize);
    return indexSize;
  }
}
