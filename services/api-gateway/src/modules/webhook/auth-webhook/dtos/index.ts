import { UserRegisterEventDto } from './user-register-event-payload.dto';
import { UserLoginEventDto } from './user-login-event-payload.dto';

export type AuthWebhookEventDto = UserRegisterEventDto | UserLoginEventDto;

export { UserRegisterEventDto, UserLoginEventDto };
