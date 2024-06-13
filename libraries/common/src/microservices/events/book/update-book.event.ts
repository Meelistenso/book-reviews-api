import { BookEventType } from '../../constants/events';
import { Book } from '@app/repositories';

export class UpdateBookEvent {
  readonly _type = BookEventType.UpdateBook;

  constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly description?: string,
    public readonly authors?: string[],
    public readonly publisher?: string,
    public readonly publishedDate?: string,
    public readonly image?: string,
    public readonly previewLink?: string,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      description: this.description,
      authors: this.authors,
      publisher: this.publisher,
      publishedDate: this.publishedDate,
      image: this.image,
      previewLink: this.publishedDate,
    });
  }
}

export class UpdateBookEventResponse {
  readonly _type = BookEventType.UpdateBook;

  constructor(public readonly book?: Book) {}

  toString() {
    return JSON.stringify({
      book: this.book,
    });
  }
}
