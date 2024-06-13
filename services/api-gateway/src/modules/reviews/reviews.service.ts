import {
  AuthEventType,
  ReviewEventType,
  AUTH_SERVICE,
  REVIEW_SERVICE,
} from '@app/common/microservices/constants';
import {
  UpdateReviewEvent,
  DeleteReviewEventResponse,
  GetPopularReviewsByBookEventResponse,
  GetReviewByIdEventResponse,
  GetReviewsByAuthorEventResponse,
  GetReviewsByBookEventResponse,
  ReactToReviewEvent,
  ReactToReviewEventResponse,
  UnreactToReviewEvent,
  UnreactToReviewEventResponse,
  UpdateReviewEventResponse,
  DeleteReviewEvent,
  GetReviewByIdEvent,
  GetReviewsByAuthorEvent,
  GetReviewsByBookEvent,
  GetPopularReviewsByBookEvent,
} from '@app/common/microservices/events/review';
import { Review } from '@app/repositories';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { CreateReviewSaga } from './sagas/create-review/create-review.saga';
import {
  CreateReviewDto,
  ReactReviewDto,
  UpdateReviewDto,
} from './dto/requests';

@Injectable()
export class ReviewsService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(
    @Inject(REVIEW_SERVICE) private readonly reviewClient: ClientKafka,
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientKafka,
    private readonly createReviewSaga: CreateReviewSaga,
  ) {}

  async onModuleInit() {
    for (const eventType of Object.values(ReviewEventType)) {
      this.logger.log(`Subscribing to response of ${eventType}`);
      this.reviewClient.subscribeToResponseOf(eventType);
    }

    this.logger.log(`Subscribing to response of ${AuthEventType.Authenticate}`);
    this.authClient.subscribeToResponseOf(AuthEventType.Authenticate);
  }

  async onApplicationShutdown() {
    await Promise.all([this.reviewClient.close(), this.authClient.close()]);
  }

  async create(
    currentUserId: number,
    { bookId, title, text, score }: CreateReviewDto,
  ) {
    this.logger.log('GATEWAY - Calling Review Service');

    try {
      await this.createReviewSaga.execute(
        new Review({ authorId: currentUserId, bookId, title, text, score }),
      );
    } catch (error) {
      this.logger.error(
        'GATEWAY - Review creation failed',
        error?.stack,
        error,
      );
      throw new BadRequestException('Review creation failed', error?.message);
      // TODO: Handle error instances
    }
  }

  update(currentUserId: number, { id, title, text, score }: UpdateReviewDto) {
    this.logger.log('GATEWAY - Calling Review Service');

    const getEvent = new GetReviewByIdEvent(id);

    return lastValueFrom(
      this.reviewClient.send(getEvent._type, getEvent).pipe(
        map((review: Review) => {
          if (review.authorId !== currentUserId) {
            throw new ForbiddenException(
              'You are not authorized to update this review',
            );
          }

          const updateEvent = new UpdateReviewEvent(id, title, text, score);

          return lastValueFrom(
            this.reviewClient.send(updateEvent._type, updateEvent).pipe(
              map(({ review }: UpdateReviewEventResponse) => {
                if (!review) {
                  this.logger.log('GATEWAY - Review not found');

                  throw new NotFoundException('Review not found');
                }

                this.logger.log('GATEWAY - Review updated successfully');
                return review;
              }),
            ),
          );
        }),
      ),
    );
  }

  getById(id: number) {
    this.logger.log('GATEWAY - Calling Review Service');

    const event = new GetReviewByIdEvent(id);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ review }: GetReviewByIdEventResponse) => {
          if (!review) {
            this.logger.log('GATEWAY - Review not found');

            throw new NotFoundException('Review not found');
          }
          this.logger.log('GATEWAY - Review retrieved');
          return review;
        }),
      ),
    );
  }

  getByAuthor(authorId: number) {
    this.logger.log('GATEWAY - Calling Review Service');

    const event = new GetReviewsByAuthorEvent(authorId);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ reviews }: GetReviewsByAuthorEventResponse) => {
          this.logger.log('GATEWAY - Reviews retrieved');

          return reviews;
        }),
      ),
    );
  }

  getByBook(bookId: number) {
    this.logger.log('GATEWAY - Calling Review Service');

    const event = new GetReviewsByBookEvent(bookId);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ reviews }: GetReviewsByBookEventResponse) => {
          this.logger.log('GATEWAY - Reviews retrieved');

          return reviews;
        }),
      ),
    );
  }

  getPopularByBook(reviewId: number) {
    this.logger.log('GATEWAY - Calling Review Service');

    const event = new GetPopularReviewsByBookEvent(reviewId);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ reviews }: GetPopularReviewsByBookEventResponse) => {
          this.logger.log('GATEWAY - Popular reviews retrieved');

          return reviews;
        }),
      ),
    );
  }

  reactReview(currentUserId: number, { isLike, bookId }: ReactReviewDto) {
    this.logger.log('GATEWAY - Calling Review Service React Method');

    const event = new ReactToReviewEvent(currentUserId, isLike, bookId);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ reaction }: ReactToReviewEventResponse) => {
          this.logger.log('GATEWAY - Review reacted');

          return reaction;
        }),
      ),
    );
  }

  unreactReview(currentUserId: number, reviewId: number) {
    this.logger.log('GATEWAY - Calling Review Service Unreact Method');

    const event = new UnreactToReviewEvent(currentUserId, reviewId);

    return lastValueFrom(
      this.reviewClient.send(event._type, event).pipe(
        map(({ reviewId, reactedById }: UnreactToReviewEventResponse) => {
          if (!reviewId || !reactedById) {
            this.logger.log('GATEWAY - Reaction not found');
            throw new NotFoundException('Reaction not found');
          }

          this.logger.log('GATEWAY - Review unreacted');
          return { reviewId, reactedById };
        }),
      ),
    );
  }

  private async fetchReview(reviewId: number): Promise<Review> {
    const getEvent = new GetReviewByIdEvent(reviewId);
    const { review }: GetReviewByIdEventResponse = await lastValueFrom(
      this.reviewClient.send(getEvent._type, getEvent),
    );

    if (!review) {
      this.logger.log('GATEWAY - Review not found');
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  private async deleteReview(reviewId: number): Promise<number> {
    const deleteEvent = new DeleteReviewEvent(reviewId);
    const { id }: DeleteReviewEventResponse = await lastValueFrom(
      this.reviewClient.send(deleteEvent._type, deleteEvent),
    );

    if (!id) {
      this.logger.log('GATEWAY - Review not found');
      throw new NotFoundException('Review not found');
    }

    this.logger.log('GATEWAY - Review deleted');
    return id;
  }

  public async delete(
    currentUserId: number,
    reviewId: number,
  ): Promise<number> {
    this.logger.log('GATEWAY - Calling Review Service Delete Method');

    const review = await this.fetchReview(reviewId);

    if (review.authorId !== currentUserId) {
      throw new ForbiddenException(
        'You are not authorized to delete this review',
      );
    }

    return this.deleteReview(reviewId);
  }
}
