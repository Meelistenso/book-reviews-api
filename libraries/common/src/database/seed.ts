import { Logger } from 'nestjs-pino';
import { Seeder } from './seeders/seeder';
import { SeederModule } from './seeders/seeder.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      appContext.useLogger(appContext.get(Logger));
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
