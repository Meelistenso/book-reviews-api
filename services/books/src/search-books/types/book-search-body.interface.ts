import { Book } from '@app/repositories';

export interface BookSearchBody
  extends Pick<
    Book,
    'id' | 'authors' | 'title' | 'description' | 'publishedDate' | 'publisher'
  > {}
