import { clients } from './clients';
import { consumers } from './consumers';
import { services } from './services';
import { ServiceDefinition } from '../types';

export const servicesDefinition = Object.keys(services).reduce(
  (acc, serviceName) => ({
    ...acc,
    [services[serviceName]]: {
      name: services[serviceName],
      client: {
        clientId: clients[serviceName],
      },
      consumer: {
        groupId: consumers[serviceName],
      },
    },
  }),
  {} as ServiceDefinition,
);
