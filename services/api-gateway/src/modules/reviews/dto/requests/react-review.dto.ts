import { IsBoolean, IsNumber } from 'class-validator';

export class ReactReviewDto {
  @IsNumber()
  bookId: number;

  @IsBoolean()
  isLike: boolean;
}
