import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('NestJS Prisma App'),
  API_PREFIX: Joi.string().default('api'),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  BACKEND_URL: Joi.string().default('http://localhost:3000'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Redis (optional)
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_TTL: Joi.number().default(3600),

  // Mail (optional)
  MAIL_HOST: Joi.string().default('smtp.gmail.com'),
  MAIL_PORT: Joi.number().default(587),
  MAIL_SECURE: Joi.boolean().default(false),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASSWORD: Joi.string().optional(),
  MAIL_FROM: Joi.string().default('noreply@example.com'),

  // Throttle
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
  THROTTLE_LIMIT_STRICT: Joi.number().default(5),
  THROTTLE_LIMIT_NORMAL: Joi.number().default(10),
  THROTTLE_LIMIT_RELAXED: Joi.number().default(30),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_TITLE: Joi.string().default('NestJS API'),
  SWAGGER_DESCRIPTION: Joi.string().default('API Documentation'),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_PATH: Joi.string().default('docs'),
});
