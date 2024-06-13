import { JwtAuthGuard, Roles } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/requests';

@Controller('/api-gateway/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('')
  getByAuthor(@Query('author') author: string | string[]) {
    return this.booksService.getByAuthor(author);
  }

  @Get('search')
  searchBook(@Query('query') query: string) {
    return this.booksService.searchBook(query);
  }

  @Get('top')
  getPopular() {
    return this.booksService.getPopular();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.booksService.getById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('top')
  @Roles('admin')
  refreshPopular() {
    return this.booksService.getPopular();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put()
  update(@Body() dto: UpdateBookDto) {
    return this.booksService.update(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post('synchronize-search')
  synchronizeSearchIndex() {
    return this.booksService.synchronizeSearchIndex();
  }
}
