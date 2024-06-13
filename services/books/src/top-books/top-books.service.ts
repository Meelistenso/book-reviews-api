import { REFRESH_TOP_BOOKS_LOCK } from '@app/common/microservices/constants/locks';
import { LocksService } from '@app/common/microservices/locks/locks.service';
import { TopBooksRepository } from '@app/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TopBooksService {
  private readonly logger = new Logger(TopBooksService.name);
  constructor(
    private readonly topBooksRepository: TopBooksRepository,
    private readonly locksService: LocksService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async refreshTopBooks() {
    const isLockAcquired = await this.locksService.acquireLock(
      REFRESH_TOP_BOOKS_LOCK,
    );

    if (isLockAcquired) {
      try {
        await this.topBooksRepository.refreshTopBooksMaterializedView();
        this.logger.log('BOOKS-SERVICE: Top Books Materialized View Refreshed');
      } catch (error) {
        this.logger.error('BOOKS-SERVICE: Failed to refresh top books', error);
        await this.locksService.releaseLock(REFRESH_TOP_BOOKS_LOCK);
      }
    } else {
      this.logger.log(
        'BOOKS-SERVICE: Refresh operation is currently locked by another instance.',
      );
    }
  }

  async getTopBooks() {
    return this.topBooksRepository.findMany({});
  }
}
