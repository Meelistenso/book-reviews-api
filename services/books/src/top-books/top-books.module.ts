import { DatabaseModule } from '@app/common';
import { LocksModule } from '@app/common/microservices/locks/locks.module';
import { Book, TopBook, TopBooksRepository } from '@app/repositories';
import { Module } from '@nestjs/common';
import { SearchBooksModule } from '../search-books/search-books.module';
import { TopBooksService } from 'services/books/src/top-books/top-books.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Book, TopBook]),
    SearchBooksModule,
    LocksModule,
  ],
  providers: [TopBooksRepository, TopBooksService],
  exports: [TopBooksService],
})
export class TopBooksModule {}
