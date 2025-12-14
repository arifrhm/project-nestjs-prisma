import { registerAs } from '@nestjs/config';
import { JwtConfig } from './configuration.types';

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN!,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
}));
