import { Review } from './entities';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReviewsRepository extends AbstractRepository<Review> {
  protected readonly logger = new Logger(ReviewsRepository.name);

  constructor(
    @InjectRepository(Review)
    reviewsRepository: Repository<Review>,
    entityManager: EntityManager,
  ) {
    super(reviewsRepository, entityManager);
  }
}
