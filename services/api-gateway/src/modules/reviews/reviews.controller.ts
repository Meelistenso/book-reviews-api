import { CurrentUser, JwtAuthGuard } from '@app/common';
import { User } from '@app/repositories';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  ReactReviewDto,
  UpdateReviewDto,
} from './dto/requests';

@Controller('/api-gateway/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reviewsService.getById(Number(id));
  }

  @Get('book/:bookId')
  getByBookId(@Param('bookId') bookId: string) {
    return this.reviewsService.getByBook(Number(bookId));
  }

  @Get('book/:bookId/popular')
  getPopularByBookId(@Param('bookId') bookId: string) {
    return this.reviewsService.getPopularByBook(Number(bookId));
  }

  @Get('user/:userId')
  getByAuthor(@Param('userId') userId: string) {
    return this.reviewsService.getByAuthor(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@CurrentUser() user: User, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/react')
  react(@CurrentUser() user: User, @Body() dto: ReactReviewDto) {
    return this.reviewsService.reactReview(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unreact')
  unreact(@CurrentUser() user: User, @Param('id') id: string) {
    return this.reviewsService.unreactReview(user.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.reviewsService.delete(user.id, Number(id));
  }
}
