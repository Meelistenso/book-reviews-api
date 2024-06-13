import { Module } from '@nestjs/common';

import { AuthWebhookModule } from './auth-webhook/auth-webhook.module';

const modules = [AuthWebhookModule];

@Module({
  imports: modules,
  exports: modules,
})
export class WebhookModule {}
