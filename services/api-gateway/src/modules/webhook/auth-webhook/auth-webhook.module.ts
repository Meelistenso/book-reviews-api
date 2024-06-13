import { AUTH_SERVICE } from '@app/common/microservices/constants';
import { getClientConfig } from '@app/common/microservices/kafka';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthWebhookController } from './auth-webhook.controller';
import { AuthWebhookService } from './auth-webhook.service';

@Module({
  imports: [ClientsModule.registerAsync([getClientConfig(AUTH_SERVICE)])],
  controllers: [AuthWebhookController],
  providers: [AuthWebhookService],
})
export class AuthWebhookModule {}
