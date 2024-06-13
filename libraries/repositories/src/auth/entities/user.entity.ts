import { AbstractEntity } from '@app/common';
import { Reaction, Review } from '@app/repositories';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  gipUserId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles?: Role[];

  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];

  @OneToMany(() => Reaction, (reaction) => reaction.reactedBy)
  reactions: Reaction[];

  @Column({ type: 'int', default: 0 })
  karma: number;
}
