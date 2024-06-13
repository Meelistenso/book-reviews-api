import {
  AUTH_SERVICE,
  AuthEventType,
} from '@app/common/microservices/constants';
import { RegisterEvent } from '@app/common/microservices/events/auth';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthWebhookEventEnum } from './auth-webhook-event.enum';

import type { AuthWebhookEventDto } from './dtos';

@Injectable()
export class AuthWebhookService {
  private readonly logger = new Logger(AuthWebhookService.name);

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientKafka,
  ) {}

  async handleWebhook({ event, payload }: AuthWebhookEventDto): Promise<void> {
    switch (event) {
      case AuthWebhookEventEnum.USER_LOGIN: {
        this.logger.log('User login event received');
        break;
      }
      case AuthWebhookEventEnum.USER_REGISTER: {
        this.logger.log('User register event received');
        this.authClient.emit(
          AuthEventType.Register,
          new RegisterEvent(
            payload.uid,
            payload.email,
            payload.displayName,
            payload.photoURL,
            payload.phoneNumber,
          ),
        );
        break;
      }
      default: {
        throw new Error(`Unknown event: ${event}`);
      }
    }
  }
}
