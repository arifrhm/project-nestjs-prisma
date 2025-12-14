import { registerAs } from '@nestjs/config';
import { AppConfig } from './configuration.types';

export default registerAs('app', (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  name: process.env.APP_NAME || 'NestJS Prisma App',
  apiPrefix: process.env.API_PREFIX || 'api',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
}));
