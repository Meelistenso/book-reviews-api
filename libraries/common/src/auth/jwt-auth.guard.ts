import {
  AUTH_SERVICE,
  AuthEventType,
} from '@app/common/microservices/constants';
import {
  AuthenticateEvent,
  AuthenticateEventResponse,
} from '@app/common/microservices/events/auth';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, lastValueFrom, map, of, tap } from 'rxjs';

// Attention! Bad practice
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientKafka,
    private readonly reflector: Reflector,
  ) {
    this.authClient.subscribeToResponseOf(AuthEventType.Authenticate);
  }

  // onModuleInit() {
  //   this.authClient.subscribeToResponseOf(AuthEventType.Authenticate);
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;
    const idToken = authorization.replace(/bearer/gim, '').trim();

    if (!idToken) {
      return Promise.resolve(false);
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const event = new AuthenticateEvent(idToken);

    return lastValueFrom(
      this.authClient.send(event._type, event).pipe(
        tap(({ user }: AuthenticateEventResponse) => {
          if (roles) {
            for (const role of roles) {
              if (!user.roles?.some((r) => r.name === role)) {
                this.logger.error('The user does not have valid roles.');
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = user;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      ),
    );
  }
}
