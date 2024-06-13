import { Reaction } from './entities';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReactionsRepository extends AbstractRepository<Reaction> {
  protected readonly logger = new Logger(ReactionsRepository.name);

  constructor(
    @InjectRepository(Reaction)
    reactionsRepository: Repository<Reaction>,
    entityManager: EntityManager,
  ) {
    super(reactionsRepository, entityManager);
  }
}
