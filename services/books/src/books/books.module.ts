import { DatabaseModule } from '@app/common';
import {
  Book,
  BooksRepository,
  Reaction,
  Review,
  Role,
  User,
} from '@app/repositories';
import { Module } from '@nestjs/common';
import { TopBooksModule } from 'services/books/src/top-books/top-books.module';
import { SearchBooksModule } from '../search-books/search-books.module';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([Book, Review, User, Role, Reaction]),
    SearchBooksModule,
    TopBooksModule,
  ],
  controllers: [BooksController],
  providers: [BooksRepository, BooksService],
})
export class BooksModule {}
