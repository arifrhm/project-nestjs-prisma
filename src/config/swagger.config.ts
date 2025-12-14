import { registerAs } from '@nestjs/config';
import { SwaggerConfig } from './configuration.types';

export default registerAs('swagger', (): SwaggerConfig => ({
  enabled: process.env.SWAGGER_ENABLED === 'true' || true,
  title: process.env.SWAGGER_TITLE || 'NestJS API',
  description: process.env.SWAGGER_DESCRIPTION || 'API Documentation',
  version: process.env.SWAGGER_VERSION || '1.0',
  path: process.env.SWAGGER_PATH || 'docs',
}));
