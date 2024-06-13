import { BaseError } from './base.error';

export class ModerationFailedError extends BaseError {
  message = 'Review text is not acceptable';
}
