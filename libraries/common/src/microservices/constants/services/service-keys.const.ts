import * as serviceConstants from './services.const';

export const SERVICE_KEYS = [...Object.values(serviceConstants)] as const;

const services = { ...serviceConstants } as const;

export { services };
