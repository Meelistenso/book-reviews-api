import { Book } from './entities';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BooksRepository extends AbstractRepository<Book> {
  protected readonly logger = new Logger(BooksRepository.name);

  constructor(
    @InjectRepository(Book)
    booksRepository: Repository<Book>,
    entityManager: EntityManager,
  ) {
    super(booksRepository, entityManager);
  }

  async findNextBatch(lastId: number, limit: number): Promise<Book[]> {
    return this.entityManager
      .createQueryBuilder(Book, 'book')
      .where('book.id > :lastId', { lastId })
      .orderBy('book.id', 'ASC')
      .take(limit)
      .getMany();
  }
}
