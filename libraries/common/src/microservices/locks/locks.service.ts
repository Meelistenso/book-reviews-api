import { LockDefinition } from '@app/common/microservices/types';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class LocksService {
  private logger = new Logger(LocksService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * Attempts to acquire a lock based on the provided lock definition.
   * @param {LockDefinition} definition The lock definition containing key and optional timeout.
   * @returns True if the lock was successfully acquired, false otherwise.
   */
  async acquireLock(definition: LockDefinition): Promise<boolean> {
    const { lockKey, lockTimeout } = definition;
    try {
      const result = lockTimeout
        ? await this.redis.set(lockKey, 'locked', 'EX', lockTimeout, 'NX')
        : await this.redis.set(lockKey, 'locked', 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error(
        `Error acquiring lock for ${lockKey}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Releases a lock.
   * @param {string} lockKey The key for the lock.
   */
  async releaseLock({
    lockKey,
  }: Pick<LockDefinition, 'lockKey'>): Promise<void> {
    try {
      await this.redis.del(lockKey);
    } catch (error) {
      this.logger.error(
        `Error releasing lock for ${lockKey}: ${error.message}`,
      );
    }
  }
}
