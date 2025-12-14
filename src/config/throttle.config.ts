import { registerAs } from '@nestjs/config';
import { ThrottleConfig } from './configuration.types';

export default registerAs('throttle', (): ThrottleConfig => ({
  ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
  limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
}));