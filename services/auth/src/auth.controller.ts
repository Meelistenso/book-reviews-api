import {
  AuthenticateEvent,
  AuthenticateEventResponse,
  ChangeKarmaEvent,
  ChangeKarmaEventResponse,
  RegisterEvent,
} from '@app/common/microservices/events/auth';
import { AuthEventType } from '@app/common/microservices/constants/events';
import { AuthEventHandlerController } from '@app/common/microservices/types/events/auth';
import { Controller, UnauthorizedException } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController implements AuthEventHandlerController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthEventType.Authenticate)
  async handleAuthenticate(
    @Payload() data: AuthenticateEvent,
  ): Promise<AuthenticateEventResponse> {
    const user = await this.authService.authenticate(data.idToken);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return new AuthenticateEventResponse(user);
  }

  @MessagePattern(AuthEventType.ChangeKarma)
  async handleChangeKarma(
    @Payload() { id, karmaDiff }: ChangeKarmaEvent,
  ): Promise<ChangeKarmaEventResponse> {
    const user = await this.authService.changeKarma(id, karmaDiff);

    return new ChangeKarmaEventResponse(user.id, user.karma);
  }

  @EventPattern(AuthEventType.Register)
  async handleRegister(@Payload() data: RegisterEvent) {
    await this.authService.register(data);
  }
}
