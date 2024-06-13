import { TopBook } from './entities';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TopBooksRepository extends AbstractRepository<TopBook> {
  protected readonly logger = new Logger(TopBooksRepository.name);

  constructor(
    @InjectRepository(TopBook)
    topBooksRepository: Repository<TopBook>,
    entityManager: EntityManager,
  ) {
    super(topBooksRepository, entityManager);
  }

  refreshTopBooksMaterializedView() {
    return this.entityManager.query(
      `REFRESH MATERIALIZED VIEW CONCURRENTLY top_book`,
    );
  }
}
