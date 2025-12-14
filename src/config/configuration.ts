import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import throttleConfig from './throttle.config';
import swaggerConfig from './swagger.config';
import { validationSchema } from './validation.schema';

export const configurations = [
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  throttleConfig,
  swaggerConfig,
];

export { validationSchema };
