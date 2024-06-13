export class ReviewCreatedEvent {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly rating: number,
    public readonly bookId: string,
    public readonly userId: string,
  ) {}

  toString() {
    return JSON.stringify({
      title: this.title,
      description: this.description,
      rating: this.rating,
      bookId: this.bookId,
      userId: this.userId,
    });
  }
}
