import {
  AUTH_SERVICE,
  AuthEventType,
} from '@app/common/microservices/constants';
import {
  ChangeKarmaEvent,
  ChangeKarmaEventResponse,
} from '@app/common/microservices/events/auth';
import { Step } from '@app/common/microservices/transactions';
import { Review } from '@app/repositories';
import { KarmaTooHighError } from '../exceptions/carma-too-high.error';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IncreaseKarmaStep
  extends Step<Review, Review>
  implements OnModuleInit
{
  private readonly logger = new Logger(IncreaseKarmaStep.name);

  constructor(
    @Inject(AUTH_SERVICE)
    private authClient: ClientKafka,
  ) {
    super();
    this.name = 'Update Karma Step';
    this.authClient.subscribeToResponseOf(AuthEventType.ChangeKarma);
  }

  async onModuleInit() {
    this.logger.log(`Subscribing to response of ${AuthEventType.ChangeKarma}`);
    this.authClient.subscribeToResponseOf(AuthEventType.ChangeKarma);
  }

  async invoke(review: Review): Promise<Review> {
    const event = new ChangeKarmaEvent(review.authorId, 1);
    const updateResult: ChangeKarmaEventResponse = await lastValueFrom(
      this.authClient.send(event._type, event),
    );

    if (updateResult.karma > 10) {
      throw new KarmaTooHighError(`Karma is too high: ${updateResult.karma}`);
    }

    this.logger.log('Karma updated');
    return review;
  }

  async withCompensation(review: Review): Promise<Review> {
    const event = new ChangeKarmaEvent(review.authorId, -1);
    await lastValueFrom(this.authClient.send(event._type, event));
    return review;
  }
}
