import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './configuration.types';

export default registerAs('database', (): DatabaseConfig => ({
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/nestjs_prisma',
}));
