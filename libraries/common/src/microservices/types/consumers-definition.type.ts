import { services } from '../constants/services';

export type ConsumersDefinition = {
  [Key in keyof typeof services]: string;
};
