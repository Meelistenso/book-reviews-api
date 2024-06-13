import { LockDefinition } from '@app/common/microservices/types';
import { LOCK_TIMEOUT } from './lock-timeout.const';
import { LOCK_KEY } from './lock-key.const';

export const REFRESH_TOP_BOOKS_LOCK: LockDefinition = {
  lockKey: LOCK_KEY,
  lockTimeout: LOCK_TIMEOUT,
};
