import { User } from './entities';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }

  async findNextBatch(lastId: number, limit: number): Promise<User[]> {
    return this.entityManager
      .createQueryBuilder(User, 'user')
      .where('user.id > :lastId', { lastId })
      .orderBy('user.id', 'ASC')
      .take(limit)
      .getMany();
  }
}
