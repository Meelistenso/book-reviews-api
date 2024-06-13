import { services } from '../constants/services';
import { clients } from '../constants/clients';
import { consumers } from '../constants/consumers';

export type MatchingClientConsumer<T extends keyof typeof services> = {
  name: (typeof services)[T];
  client: {
    clientId: (typeof clients)[T];
  };
  consumer: {
    groupId: (typeof consumers)[T];
  };
};

export type ServiceDefinition = {
  [serviceName in keyof typeof services]: MatchingClientConsumer<serviceName>;
};
