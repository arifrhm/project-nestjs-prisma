import { Throttle } from '@nestjs/throttler';

/**
 * Strict throttling: 5 requests per configured TTL
 * For critical endpoints like login, register
 * Uses THROTTLE_LIMIT_STRICT env variable (default: 5)
 */
export const StrictThrottle = () => {
  const limit = parseInt(process.env.THROTTLE_LIMIT_STRICT || '5', 10);
  const ttl = parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000;
  return Throttle({ default: { limit, ttl } });
};

/**
 * Normal throttling: 10 requests per configured TTL
 * For standard endpoints (POST, PATCH, DELETE)
 * Uses THROTTLE_LIMIT_NORMAL env variable (default: 10)
 */
export const NormalThrottle = () => {
  const limit = parseInt(process.env.THROTTLE_LIMIT_NORMAL || '10', 10);
  const ttl = parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000;
  return Throttle({ default: { limit, ttl } });
};

/**
 * Relaxed throttling: 30 requests per configured TTL
 * For read-only endpoints (GET)
 * Uses THROTTLE_LIMIT_RELAXED env variable (default: 30)
 */
export const RelaxedThrottle = () => {
  const limit = parseInt(process.env.THROTTLE_LIMIT_RELAXED || '30', 10);
  const ttl = parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000;
  return Throttle({ default: { limit, ttl } });
};
