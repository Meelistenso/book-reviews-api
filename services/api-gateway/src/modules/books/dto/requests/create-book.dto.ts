import { IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  authors: string[];

  @IsString()
  publisher: string;

  @IsString()
  publishedDate: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  previewLink?: string;
}
