import { JwtAuthGuard } from '@app/common';
import {
  AUTH_SERVICE,
  BOOK_SERVICE,
} from '@app/common/microservices/constants';
import { getClientConfig } from '@app/common/microservices/kafka';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      getClientConfig(AUTH_SERVICE, BooksModule.name + '_'),
      getClientConfig(BOOK_SERVICE, BooksModule.name + '_'),
    ]),
  ],
  controllers: [BooksController],
  providers: [JwtAuthGuard, BooksService],
})
export class BooksModule {}
