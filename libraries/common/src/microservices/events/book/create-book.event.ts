import { BookEventType } from '../../constants/events';
import { Book } from '@app/repositories';

export class CreateBookEvent {
  readonly _type = BookEventType.CreateBook;

  constructor(
    public readonly title: string,
    public readonly authors: string[],
    public readonly publisher: string,
    public readonly publishedDate: string,
    public readonly description?: string,
    public readonly image?: string,
    public readonly previewLink?: string,
  ) {}

  toString() {
    return JSON.stringify({
      title: this.title,
      authors: this.authors,
      publisher: this.publisher,
      publishedDate: this.publishedDate,
      description: this.description,
      image: this.image,
      previewLink: this.previewLink,
    });
  }
}

export class CreateBookEventResponse {
  readonly _type = BookEventType.CreateBook;

  constructor(public readonly book: Book) {}

  toString() {
    return JSON.stringify({
      book: this.book,
    });
  }
}
