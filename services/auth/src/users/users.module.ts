import { Role, User, UsersRepository } from '@app/repositories';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
