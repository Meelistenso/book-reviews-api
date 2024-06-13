import { IsObject, IsString } from 'class-validator';
import { AuthWebhookEventEnum } from 'services/api-gateway/src/modules/webhook/auth-webhook/auth-webhook-event.enum';

export class UserRegisterEventDto {
  @IsString()
  event: typeof AuthWebhookEventEnum.USER_REGISTER;

  @IsObject()
  payload: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
  };
}
