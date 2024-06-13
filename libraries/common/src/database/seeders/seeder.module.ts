import { ReviewsSeederModule } from './reviews/reviews.module';
import { UsersSeederModule } from './users/users.module';
import { BooksSeederModule } from './books/books.module';
import { LoggerModule } from 'nestjs-pino';
import { Seeder } from './seeder';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BooksSeederModule,
    UsersSeederModule,
    ReviewsSeederModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
  ],
  providers: [Seeder],
})
export class SeederModule {}
