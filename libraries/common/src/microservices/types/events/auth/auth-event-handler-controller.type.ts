import { AuthEventResponse } from './auth-event-response.type';
import { AuthEvent } from './auth-event.type';
import { AuthEventType } from '../../../constants/events';
import { EventHandlerController } from '@app/common/microservices/types';

export type AuthEventHandlerController = EventHandlerController<
  typeof AuthEventType,
  AuthEvent,
  AuthEventResponse
>;
