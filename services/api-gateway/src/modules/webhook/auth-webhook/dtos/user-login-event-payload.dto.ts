import { IsObject, IsString } from 'class-validator';
import { AuthWebhookEventEnum } from 'services/api-gateway/src/modules/webhook/auth-webhook/auth-webhook-event.enum';

export class UserLoginEventDto {
  @IsString()
  event: typeof AuthWebhookEventEnum.USER_LOGIN;

  @IsObject()
  payload: string;
}
