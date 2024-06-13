import { AbstractEntity } from '@app/common';
import { User } from '@app/repositories';
import { Review } from './review.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reaction extends AbstractEntity<Reaction> {
  @ManyToOne(() => Review, (review) => review.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  review: Review;

  @Column({ type: 'int' })
  reviewId: number;

  @ManyToOne(() => User, (user) => user.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  reactedBy: User;

  @Column({ type: 'int' })
  reactedById: number;

  @Column({ type: 'boolean' })
  isLike: boolean;
}
