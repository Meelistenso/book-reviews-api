import { Controller, Get } from '@nestjs/common';

@Controller('/api-gateway/')
export class HealthController {
  @Get()
  health() {
    return true;
  }
}
