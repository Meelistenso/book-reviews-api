import { ReviewEventResponse } from './review-event-response.type';
import { ReviewEventType } from '../../../constants/events';
import { ReviewEvent } from './review-event.type';
import { EventHandlerController } from '@app/common/microservices/types';

export type ReviewEventHandlerController = EventHandlerController<
  typeof ReviewEventType,
  ReviewEvent,
  ReviewEventResponse
>;
