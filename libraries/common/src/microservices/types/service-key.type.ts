import { ServiceName } from './service-name.type';
import { services } from '../constants/services';

export type ServiceKey = (typeof services)[ServiceName];
