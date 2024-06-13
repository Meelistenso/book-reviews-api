import { ConsumersDefinition } from '../../types';

export const consumers: ConsumersDefinition = {
  API_GATEWAY: 'api-gateway-consumer',
  AUTH_SERVICE: 'auth-consumer',
  BOOK_SERVICE: 'book-consumer',
  REVIEW_SERVICE: 'review-consumer',
  MODERATION_SERVICE: 'moderation-consumer',
} as const;
