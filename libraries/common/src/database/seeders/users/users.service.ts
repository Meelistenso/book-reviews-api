import { DataStream } from 'scramjet';
import * as faker from 'faker';
import { Injectable, Logger } from '@nestjs/common';
import { User, UsersRepository } from '@app/repositories';

@Injectable()
export class UsersSeederService {
  protected readonly logger = new Logger(UsersSeederService.name);
  private readonly BATCH_SIZE = 150;

  constructor(private readonly usersRepository: UsersRepository) {}

  async seedUsersWithFaker(count: number = 100): Promise<void> {
    return DataStream.from(function* () {
      for (let i = 0; i < count; i++) {
        yield new User({
          gipUserId: faker.datatype.uuid(),
          email: faker.internet.email(),
          name: faker.name.findName(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        });
      }
    })
      .batch(this.BATCH_SIZE)
      .each(async (usersBatch) => {
        await this.usersRepository.createMany(usersBatch);
      })
      .run();
  }
}
