import { Role, User, UsersRepository } from '@app/repositories';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(user: Pick<User, 'id'>) {
    return this.usersRepository.findOne(user, { roles: true });
  }

  async getAll() {
    this.logger.log('AUTH-SERVICE - Getting Users');
    return this.usersRepository.find({});
  }

  async getByEmail(email: string) {
    this.logger.log('AUTH-SERVICE: FindUser triggered');
    const foundUser = await this.usersRepository.findOne({ email });

    if (foundUser) {
      this.logger.log('AUTH-SERVICE - User found');
    } else {
      this.logger.log('AUTH-SERVICE - User not found');
    }

    return foundUser;
  }

  async create(
    payload: Pick<User, 'email' | 'gipUserId' | 'name'>,
    roles: Pick<Role, 'id'>[] = [],
  ) {
    const user = new User({
      ...payload,
      roles: roles?.map((role) => new Role(role)),
    });
    return this.usersRepository.create(user);
  }

  async update({ id, ...data }: Pick<User, 'roles' | 'id' | 'name'>) {
    this.logger.log('AUTH-SERVICE - Updating User');

    return this.usersRepository.findOneAndUpdate({ id }, data);
  }

  private async validateUser(createUserDto: Pick<User, 'email'>) {
    try {
      await this.getByEmail(createUserDto.email);
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async getUserByGipId(gipUserId: string) {
    return this.usersRepository.findOne({ gipUserId }, { roles: true });
  }
}
