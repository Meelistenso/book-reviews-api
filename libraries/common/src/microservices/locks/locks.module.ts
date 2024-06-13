import { LocksService } from './locks.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url:
          'redis://' +
          configService.getOrThrow('REDIS_HOST') +
          ':' +
          configService.getOrThrow('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LocksService],
  exports: [LocksService],
})
export class LocksModule {}
