import { AbstractEntity } from '@app/common';
import { Reaction } from './reaction.entity';
import { User, Book } from '@app/repositories';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Review extends AbstractEntity<Review> {
  @Column({ nullable: true })
  title: string | null;

  @Column({ nullable: true })
  text?: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn()
  @Index()
  author: User;

  @Column({ type: 'int', nullable: true })
  authorId: number;

  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn()
  @Index()
  book: Book;

  @Column({ type: 'int', nullable: true })
  bookId: number;

  @Column({ type: 'int' })
  score: number;

  @OneToMany(() => Reaction, (reaction) => reaction.review)
  reactions: Reaction[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column({ type: 'varchar', default: 'draft' })
  status: 'draft' | 'published' | 'cancelled';
}
