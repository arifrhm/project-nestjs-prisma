export interface DatabaseConfig {
  url: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  name: string;
  apiPrefix: string;
  frontendUrl: string;
  backendUrl: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

// All configuration interfaces combined
export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis?: RedisConfig;
  mail?: MailConfig;
  throttle: ThrottleConfig;
  swagger: SwaggerConfig;
}

export type ConfigKeyPaths = {
  [T in keyof AllConfigType]: {
    [K in keyof AllConfigType[T]]: `${T}.${K & string}`
  }[keyof AllConfigType[T]]
}[keyof AllConfigType];
