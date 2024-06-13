import { BaseError } from './base.error';

export class CreatingFailedError extends BaseError {
  message = 'Review already exists';
}
