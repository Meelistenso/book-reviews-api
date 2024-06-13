import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  authors?: string[];

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  publishedDate?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  previewLink?: string;
}
