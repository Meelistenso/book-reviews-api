import { DatabaseModule } from '@app/common';
import {
  Book,
  Reaction,
  ReactionsRepository,
  Review,
  ReviewsRepository,
  Role,
  User,
} from '@app/repositories';
import { Module } from '@nestjs/common';
import { ReviewFeedService } from './feed.service';
import { ReviewFeedController } from './feed.controller';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Book, Review, User, Role, Reaction]),
  ],
  controllers: [ReviewFeedController],
  providers: [ReviewsRepository, ReactionsRepository, ReviewFeedService],
})
export class ReviewFeedModule {}
