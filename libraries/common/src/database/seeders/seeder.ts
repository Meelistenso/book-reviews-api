import { ReviewsSeederService } from '@app/common/database/seeders/reviews/reviews.service';
import { UsersSeederService } from './users/users.service';
import { BooksSeederService } from './books/books.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    private readonly booksSeederService: BooksSeederService,
    private readonly usersSeederService: UsersSeederService,
    private readonly reviewsSeederService: ReviewsSeederService,
  ) {}

  async seed() {
    try {
      await this.seedBooks();
      this.logger.debug('Successfully completed seeding books...');
    } catch (error) {
      this.logger.error('Failed seeding books...');
      // await this.revertSeed(SEEDING_STEP.BOOKS);
      throw error;
    }

    try {
      await this.seedUsers();
      this.logger.debug('Successfully completed seeding users...');
    } catch (error) {
      this.logger.error('Failed seeding users...');
      // await this.revertSeed(SEEDING_STEP.USERS);
      throw error;
    }

    try {
      await this.seedReviews();
      this.logger.debug('Successfully completed seeding reviews...');
    } catch (error) {
      this.logger.error('Failed seeding reviews...');
      // await this.revertSeed(SEEDING_STEP.REVIEWS);
      throw error;
    }
  }

  async seedBooks() {
    await this.booksSeederService.seedBooksFromCsv(
      'pet-project-seed-data',
      'books_data.csv',
    );
  }

  async seedUsers() {
    await this.usersSeederService.seedUsersWithFaker(100);
  }

  async seedReviews() {
    await this.reviewsSeederService.seedReviewsWithFaker(0, 50);
  }
}
