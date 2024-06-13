import { BookEventType } from '../../constants/events';

export class DeleteBookEvent {
  readonly _type = BookEventType.DeleteBook;

  constructor(public readonly id: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}

export class DeleteBookEventResponse {
  readonly _type = BookEventType.DeleteBook;

  constructor(public readonly id?: number) {}

  toString() {
    return JSON.stringify({
      id: this.id,
    });
  }
}
