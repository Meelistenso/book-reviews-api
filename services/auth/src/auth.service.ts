import { RegisterEvent } from '@app/common/microservices/events/auth';
import { User } from '@app/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { auth } from 'firebase-admin';
import { UsersService } from 'services/auth/src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject('FIREBASE_AUTH') private firebaseAuth: auth.Auth,
  ) {}

  async authenticate(idToken: string): Promise<User> {
    this.logger.log('AUTH-SERVICE: Authenticate triggered');
    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
      const userId = decodedToken.uid;

      return await this.usersService.getUserByGipId(userId);
    } catch (error) {
      this.logger.error(
        'AUTH-SERVICE: Error authenticating user' + error.message,
        error.stack,
        JSON.stringify(error),
      );
    }
  }

  async changeKarma(id: number, karmaDiff: number): Promise<User> {
    this.logger.log('AUTH-SERVICE: Change karma triggered');
    try {
      const user = await this.usersService.getUser({ id });
      if (!user) {
        this.logger.error('AUTH-SERVICE: User not found');
        return;
      }
      user.karma += karmaDiff;
      return await this.usersService.update(user);
    } catch (error) {
      this.logger.error('AUTH-SERVICE: Error changing karma. ' + error.message);
    }
  }

  async register({ uid, email, displayName }: RegisterEvent): Promise<User> {
    this.logger.log('AUTH-SERVICE: Register triggered');
    try {
      const existingUser = await this.usersService.getUserByGipId(uid);
      if (!existingUser) {
        this.logger.log('AUTH-SERVICE: Creating new user');
        return await this.usersService.create({
          email,
          gipUserId: uid,
          name: displayName || 'guest',
        });
      }
      this.logger.log('AUTH-SERVICE: User already exists');
    } catch (error) {
      this.logger.error('AUTH-SERVICE: Error creating user. ' + error.message);
    }
  }
}
