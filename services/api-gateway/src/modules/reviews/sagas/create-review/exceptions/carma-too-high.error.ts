import { BaseError } from './base.error';

export class KarmaTooHighError extends BaseError {
  message = 'Karma is too high';
}
