import { DatabaseModule } from '@app/common';
import {
  Book,
  BooksRepository,
  Reaction,
  ReactionsRepository,
  Review,
  ReviewsRepository,
  Role,
  UsersRepository,
  User,
} from '@app/repositories';
import { ReviewsSeederService } from './reviews.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Book, Review, User, Role, Reaction]),
  ],
  providers: [
    ReviewsSeederService,
    BooksRepository,
    ReactionsRepository,
    ReviewsRepository,
    UsersRepository,
  ],
  exports: [ReviewsSeederService],
})
export class ReviewsSeederModule {}
