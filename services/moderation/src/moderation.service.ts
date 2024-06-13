import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  async check(text: string) {
    const isAcceptable = Math.random() > 0.5;
    this.logger.log(
      `ModerationService: Text "${text}" is ${isAcceptable ? 'acceptable' : 'unacceptable'}`,
    );
    return isAcceptable;
  }
}
