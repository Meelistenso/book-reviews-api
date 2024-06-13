import { servicesDefinition } from '@app/common/microservices/constants';
import { Partitioners } from 'kafkajs';
import { ServiceKey } from '../types';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

export const getClientConfig = (
  serviceKey: ServiceKey,
  prefix: string = '',
): ClientsProviderAsyncOptions => {
  return {
    name: servicesDefinition[serviceKey].name,
    useFactory: () => ({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: prefix + servicesDefinition[serviceKey].client.clientId,
          brokers: [process.env.KAFKA_BROKERCONNECT],
        },
        consumer: {
          groupId: servicesDefinition[serviceKey].consumer.groupId,
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    }),
  };
};
