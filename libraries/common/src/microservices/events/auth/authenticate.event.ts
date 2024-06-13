import { AuthEventType } from 'libraries/common/src/microservices/constants/events';
import { User } from '@app/repositories';

export class AuthenticateEvent {
  readonly _type = AuthEventType.Authenticate;

  constructor(public readonly idToken: string) {}

  toString() {
    return JSON.stringify({
      idToken: this.idToken,
    });
  }
}

export class AuthenticateEventResponse {
  readonly _type = AuthEventType.Authenticate;

  constructor(public readonly user: User) {}

  toString() {
    return JSON.stringify({
      user: this.user,
    });
  }
}
