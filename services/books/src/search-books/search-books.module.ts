import { Module } from '@nestjs/common';
import { SearchModule } from '../providers/search/search.module';
import { SearchBooksService } from './search-books.service';

@Module({
  imports: [SearchModule],
  providers: [SearchBooksService],
  exports: [SearchBooksService],
})
export class SearchBooksModule {}
