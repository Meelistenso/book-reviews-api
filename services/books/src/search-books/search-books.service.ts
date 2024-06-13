import { Book } from '@app/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BOOK_SEARCH_INDEX } from './contants/book-search-index.const';
import { BookSearchBody } from './types';

@Injectable()
export class SearchBooksService {
  private readonly index = BOOK_SEARCH_INDEX;

  private readonly logger = new Logger(SearchBooksService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async checkBooksIndexExists() {
    this.logger.log('BOOK-SERVICE: Checking if books index exists');
    return this.elasticsearchService.indices.exists({ index: this.index });
  }

  async createIndex() {
    this.logger.log('BOOK-SERVICE: Creating index for books');
    await this.elasticsearchService.indices.create(
      {
        index: this.index,
        mappings: {
          properties: {
            id: { type: 'integer' },
            title: { type: 'text' },
            description: { type: 'text' },
            authors: { type: 'keyword' },
            publishedDate: { type: 'text' },
            publisher: { type: 'text' },
          },
        },
      },
      { ignore: [400] },
    );
  }

  async clearFullIndex() {
    this.logger.log('BOOK-SERVICE: Clearing full index for books');
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match_all: {},
      },
    });
  }

  async getIndexCount() {
    const { count } = await this.elasticsearchService.count({
      index: this.index,
    });

    return count;
  }

  async indexBooks(books: Book[]) {
    this.logger.log('BOOK-SERVICE: Bulk indexing books triggered');

    const operations = books.flatMap((book) => [
      { index: { _index: this.index } },
      {
        id: book.id,
        title: book.title,
        description: book.description,
        authors: book.authors,
        publishedDate: book.publishedDate,
        publisher: book.publisher,
      },
    ]);

    const bulkResponse = await this.elasticsearchService.bulk({
      refresh: true,
      operations,
    });

    if (bulkResponse.errors) {
      const erroredDocuments = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1],
          });
        }
      });
      this.logger.error('Error indexing books', erroredDocuments);
    }

    this.logger.log(`BOOK-SERVICE: ${books.length} books indexed`);
  }

  async indexBook(book: Book) {
    this.logger.log(`BOOK-SERVICE: Indexing book with id: ${book.id}`);
    return this.elasticsearchService.index<BookSearchBody>({
      index: this.index,
      document: {
        id: book.id,
        title: book.title,
        description: book.description,
        authors: book.authors,
        publishedDate: book.publishedDate,
        publisher: book.publisher,
      },
    });
  }

  async remove(bookId: number) {
    this.logger.log(`BOOK-SERVICE: Removing book index with id: ${bookId}`);
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: bookId,
        },
      },
    });
  }

  async update(book: Book) {
    this.logger.log(`BOOK-SERVICE: Updating book index with id: ${book.id}`);
    const newBody: BookSearchBody = {
      id: book.id,
      title: book.title,
      description: book.description,
      authors: book.authors,
      publishedDate: book.publishedDate,
      publisher: book.publisher,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      query: {
        match: {
          id: book.id,
        },
      },
      script: {
        source: script,
        lang: 'painless',
      },
    });
  }

  async search(
    text: string,
    size: number = 25,
    lastId: string = null,
    lastScore: number = null,
  ) {
    this.logger.log(`BOOK-SERVICE: Searching for books with text: ${text}`);
    const searchParams: any = {
      index: this.index,
      size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: text,
              fields: [
                'title^3',
                'authors^2',
                'description',
                'publisher',
                'publishedDate',
              ],
              type: 'best_fields',
            },
          },
        },
      },
      sort: [
        {
          _score: {
            order: 'desc',
          },
        },
      ],
    };

    if (lastId && lastScore) {
      searchParams.search_after = [lastScore, lastId];
    }

    const { hits } =
      await this.elasticsearchService.search<BookSearchBody>(searchParams);

    return hits.hits.map((item) => item._source);
  }
}
