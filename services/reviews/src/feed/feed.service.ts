import {
  Book,
  ReactionsRepository,
  Review,
  ReviewsRepository,
  User,
} from '@app/repositories';
import { Reaction } from '@app/repositories/reviews/entities/reaction.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReviewFeedService {
  private readonly logger = new Logger(ReviewFeedService.name);
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly reactionsRepository: ReactionsRepository,
  ) {}

  async createReview(
    payload: Pick<Review, 'authorId' | 'bookId' | 'title' | 'text' | 'score'>,
  ) {
    this.logger.log('REVIEW-SERVICE: Create review triggered');

    const existingReview = await this.reviewsRepository.findOne({
      authorId: payload.authorId,
      bookId: payload.bookId,
    });

    if (existingReview) {
      this.logger.log('REVIEW-SERVICE: Review already exists');

      return;
    }

    const newReview = new Review(payload);

    const createdReview = await this.reviewsRepository.create(newReview);

    this.logger.log('REVIEW-SERVICE: Review created');

    return createdReview;
  }

  async updateReview({
    id,
    ...payload
  }: Pick<Review, 'id'> & Pick<Partial<Review>, 'title' | 'text' | 'score'>) {
    this.logger.log('REVIEW-SERVICE: Update review triggered');

    const existingReview = await this.reviewsRepository.findOne({
      id,
    });

    if (existingReview) {
      return await this.reviewsRepository.update(
        {
          id,
        },
        {
          ...payload,
          createdAt: existingReview.createdAt,
          authorId: existingReview.authorId,
        },
      );
    }
  }

  async getByAuthor(payload: Pick<User, 'id'>) {
    this.logger.log('REVIEW-SERVICE: Get reviews by author triggered');

    return await this.reviewsRepository.find({
      authorId: payload.id,
    });
  }

  async getByBook(payload: Pick<Book, 'id'>) {
    this.logger.log('REVIEW-SERVICE: Get reviews by book triggered');

    return await this.reviewsRepository.find({
      bookId: payload.id,
    });
  }

  async getPopularByBook(payload: Pick<Book, 'id'>) {
    this.logger.log('REVIEW-SERVICE: Get reviews by book triggered');

    return await this.reviewsRepository.find({
      bookId: payload.id,
    });
  }

  async getById(id: Review['id']) {
    this.logger.log('REVIEW-SERVICE: Get review by ID triggered');

    return await this.reviewsRepository.findOne({ id });
  }

  async reactToReview(
    payload: Pick<Reaction, 'reactedById' | 'isLike' | 'reviewId'>,
  ) {
    this.logger.log('REVIEW-SERVICE: React to review triggered');

    const existingReview = await this.reactionsRepository.findOne({
      reactedById: payload.reactedById,
      reviewId: payload.reviewId,
    });

    if (existingReview) {
      this.logger.log('REVIEW-SERVICE: Reaction already exists, updating');
      await this.reactionsRepository.update(
        {
          reactedById: payload.reactedById,
          reviewId: payload.reviewId,
        },
        {
          isLike: payload.isLike,
        },
      );

      return this.reactionsRepository.findOne({
        reactedById: payload.reactedById,
        reviewId: payload.reviewId,
      });
    }

    this.logger.log('REVIEW-SERVICE: Reaction not exists, creating');

    return this.reactionsRepository.create(new Reaction(payload));
  }

  unreactToReview(
    payload: Pick<Reaction, 'reactedById' | 'reviewId'> | Pick<Reaction, 'id'>,
  ) {
    this.logger.log('REVIEW-SERVICE: Unreact to review triggered');

    return this.reactionsRepository.findOneAndDelete(payload);
  }

  async deleteReview(
    payload: Pick<Review, 'authorId' | 'bookId'> | Pick<Review, 'id'>,
  ) {
    this.logger.log('REVIEW-SERVICE: Delete review triggered');

    return this.reviewsRepository.findOneAndDelete(payload);
  }
}
