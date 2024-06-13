import { ClientsDefinition } from '../../types';

export const clients: ClientsDefinition = {
  API_GATEWAY: 'api-gateway',
  AUTH_SERVICE: 'auth',
  BOOK_SERVICE: 'book',
  REVIEW_SERVICE: 'review',
  MODERATION_SERVICE: 'moderation',
} as const;
