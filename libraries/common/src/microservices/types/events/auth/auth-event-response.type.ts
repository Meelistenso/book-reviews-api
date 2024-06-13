import {
  AuthenticateEventResponse,
  ChangeKarmaEventResponse,
} from '../../../events/auth';

export type AuthEventResponse =
  | AuthenticateEventResponse
  | ChangeKarmaEventResponse;
