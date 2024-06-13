import { AbstractEntity } from '@app/common';
import { Book } from '@app/repositories';
import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      book.id,
      book.title,
      book.description,
      book.authors,
      book.image,
      book."previewLink",
      book.publisher,
      book."createdAt",
      book."updatedAt",
      AVG(review.score) as "averageScore",
      COUNT(review.id) as "reviewCount"
    FROM book
    INNER JOIN review ON book.id = review."bookId"
    GROUP BY book.id
    ORDER BY "averageScore" DESC, "reviewCount" DESC
    LIMIT 25;
  `,
  name: 'top_book',
  materialized: true,
})
export class TopBook extends AbstractEntity<Book> {
  @Column({ nullable: true })
  averageScore: number;

  @Column({ nullable: true })
  reviewCount: number;
}
