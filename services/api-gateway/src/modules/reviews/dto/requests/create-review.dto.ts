import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  bookId: number;

  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsNumber()
  score: number;
}
