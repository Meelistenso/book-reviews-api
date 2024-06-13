import {
  AuthenticateEvent,
  ChangeKarmaEvent,
  RegisterEvent,
} from '../../../events/auth';

export type AuthEvent = AuthenticateEvent | RegisterEvent | ChangeKarmaEvent;
