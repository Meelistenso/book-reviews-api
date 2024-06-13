export class GetBookRequest {
  constructor(public readonly bookId: string) {}

  toString() {
    return JSON.stringify({
      bookId: this.bookId,
    });
  }
}
