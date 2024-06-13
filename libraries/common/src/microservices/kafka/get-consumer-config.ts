import { servicesDefinition } from '@app/common/microservices/constants';
import { ServiceKey } from '@app/common/microservices/types';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import * as process from 'process';

export const getConsumerConfig = (
  serviceKey: ServiceKey,
): MicroserviceOptions => {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERCONNECT],
      },
      consumer: {
        groupId: servicesDefinition[serviceKey].consumer.groupId,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  };
};
