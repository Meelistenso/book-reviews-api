import { ModerationEventType } from '@app/common/microservices/constants';
import {
  CheckTextEvent,
  CheckTextEventResponse,
} from '@app/common/microservices/events/moderation';
import { ModerationEventHandlerController } from '@app/common/microservices/types/events/moderation';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ModerationService } from './moderation.service';

@Controller()
export class ModerationController implements ModerationEventHandlerController {
  constructor(private readonly moderationService: ModerationService) {}

  @MessagePattern(ModerationEventType.CheckText)
  async handleCheckText({
    text,
  }: CheckTextEvent): Promise<CheckTextEventResponse> {
    const isAcceptable = await this.moderationService.check(text);
    return new CheckTextEventResponse(isAcceptable);
  }
}
