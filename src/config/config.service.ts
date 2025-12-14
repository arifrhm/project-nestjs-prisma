import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { AllConfigType, ConfigKeyPaths } from './configuration.types';

@Injectable()
export class ConfigService {
  constructor(
    private readonly configService: NestConfigService<AllConfigType, true>,
  ) {}

  /**
   * Get configuration value with type safety
   */
  get<T extends ConfigKeyPaths>(key: T) {
    const parts = String(key).split('.');
    const namespace = parts[0] as keyof AllConfigType;
    const property = parts[1];
    
    if (!namespace || !property) {
      throw new Error('Invalid configuration key');
    }
    
    return this.configService.get(namespace, { infer: true })?.[property];
  }

  /**
   * Get app config
   */
  getApp() {
    return this.configService.get('app', { infer: true });
  }

  /**
   * Get database config
   */
  getDatabase() {
    return this.configService.get('database', { infer: true });
  }

  /**
   * Get JWT config
   */
  getJwt() {
    return this.configService.get('jwt', { infer: true });
  }

  /**
   * Get Redis config (if exists)
   */
  getRedis() {
    return this.configService.get('redis', { infer: true });
  }

  /**
   * Get Throttle config
   */
  getThrottle() {
    return this.configService.get('throttle', { infer: true });
  }

  /**
   * Get Swagger config
   */
  getSwagger() {
    return this.configService.get('swagger', { infer: true });
  }

  /**
   * Get environment
   */
  getEnv() {
    return this.getApp().nodeEnv;
  }

  /**
   * Check if environment is production
   */
  isProd(): boolean {
    return this.getEnv() === 'production';
  }

  /**
   * Check if environment is development
   */
  isDev(): boolean {
    return this.getEnv() === 'development';
  }

  /**
   * Check if environment is test
   */
  isTest(): boolean {
    return this.getEnv() === 'test';
  }
}
