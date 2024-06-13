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
import { BooksSeederService } from './books.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Book, Review, User, Role, Reaction]),
  ],
  providers: [
    BooksSeederService,
    BooksRepository,
    ReactionsRepository,
    ReviewsRepository,
    UsersRepository,
  ],
  exports: [BooksSeederService],
})
export class BooksSeederModule {}
