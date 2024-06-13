import * as faker from 'faker';
import { Injectable, Logger } from '@nestjs/common';
import {
  UsersRepository,
  BooksRepository,
  ReviewsRepository,
  Review,
} from '@app/repositories';
import { shuffle } from 'lodash';

@Injectable()
export class ReviewsSeederService {
  protected readonly logger = new Logger(ReviewsSeederService.name);
  private readonly BATCH_SIZE = 150;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly booksRepository: BooksRepository,
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  async seedReviewsWithFaker(
    minCount: number,
    maxCount: number = 100,
  ): Promise<void> {
    let lastUserId = 0;
    let lastBookId = 0;

    while (true) {
      const users = await this.usersRepository.findNextBatch(
        lastUserId,
        this.BATCH_SIZE,
      );
      if (users.length === 0) break;

      for (const user of users) {
        this.logger.debug(`Seeding reviews for user ${user.id}`);
        const booksToReview = faker.datatype.number({
          min: minCount,
          max: maxCount,
        });
        let booksReviewed = 0;

        while (booksReviewed < booksToReview) {
          let books = await this.booksRepository.findNextBatch(
            lastBookId,
            this.BATCH_SIZE,
          );
          if (books.length === 0) break;

          // Shuffle the books array
          books = shuffle(books);

          const reviewsBatch = [];

          for (const book of books) {
            const review = new Review({
              authorId: user.id,
              bookId: book.id,
              score: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              createdAt: faker.date.past(),
              updatedAt: faker.date.recent(),
            });

            reviewsBatch.push(review);
            booksReviewed++;

            if (booksReviewed >= booksToReview) break;
          }

          await this.reviewsRepository.createMany(reviewsBatch);

          lastBookId = books[books.length - 1].id;
        }
      }

      lastUserId = users[users.length - 1].id;
    }
  }
}
