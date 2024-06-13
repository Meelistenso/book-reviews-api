import { ModerationEventResponse } from './moderation-event-response.type';
import { ModerationEvent } from './moderation-event.type';
import { ModerationEventType } from '../../../constants/events';
import { EventHandlerController } from '@app/common/microservices/types';

export type ModerationEventHandlerController = EventHandlerController<
  typeof ModerationEventType,
  ModerationEvent,
  ModerationEventResponse
>;
