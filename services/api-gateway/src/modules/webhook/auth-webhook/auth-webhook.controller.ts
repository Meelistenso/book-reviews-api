import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthWebhookEventDto } from './dtos';

import { AuthWebhookService } from './auth-webhook.service';

@Controller({ path: '/api-gateway/webhook/auth' })
export class AuthWebhookController {
  constructor(
    private readonly service: AuthWebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async handleIncomingEvents(
    @Headers() headers: Record<string, string>,
    @Res() response: Response,
    @Body() event: AuthWebhookEventDto,
  ): Promise<void> {
    const secretHeader = headers['x-api-key'];
    const secretValue = this.configService.getOrThrow('WEBHOOK_API_KEY', {
      infer: true,
    });
    if (secretHeader !== secretValue) {
      throw new ForbiddenException('Invalid secret');
    }

    try {
      await this.service.handleWebhook(event as AuthWebhookEventDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    response.sendStatus(HttpStatus.OK);
  }
}
