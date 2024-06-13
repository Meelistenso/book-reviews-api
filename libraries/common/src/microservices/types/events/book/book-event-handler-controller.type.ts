import { BookEventResponse } from './book-event-response.type';
import { BookEventType } from '../../../constants/events';
import { BookEvent } from './book-event.type';
import { EventHandlerController } from '@app/common/microservices/types';

export type BookEventHandlerController = EventHandlerController<
  typeof BookEventType,
  BookEvent,
  BookEventResponse
>;
