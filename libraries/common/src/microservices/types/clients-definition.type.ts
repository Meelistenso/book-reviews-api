import { services } from '../constants/services';

export type ClientsDefinition = {
  [Key in keyof typeof services]: string;
};
