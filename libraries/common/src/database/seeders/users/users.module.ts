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
import { UsersSeederService } from './users.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Book, Review, User, Role, Reaction]),
  ],
  providers: [
    UsersSeederService,
    BooksRepository,
    ReactionsRepository,
    ReviewsRepository,
    UsersRepository,
  ],
  exports: [UsersSeederService],
})
export class UsersSeederModule {}
