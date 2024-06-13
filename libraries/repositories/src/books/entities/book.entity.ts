import { AbstractEntity } from '@app/common';
import { Review } from '@app/repositories';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Book extends AbstractEntity<Book> {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true, array: true })
  authors?: string[];

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  previewLink?: string;

  @Column({ nullable: true })
  publisher?: string;

  @Column({ nullable: true })
  publishedDate?: string;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
}
