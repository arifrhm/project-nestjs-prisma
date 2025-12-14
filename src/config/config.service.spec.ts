import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { configurations, validationSchema } from './configuration';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    // Set required environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configurations,
          validationSchema,
          isGlobal: true,
        }),
      ],
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get app config', () => {
    const appConfig = service.getApp();
    expect(appConfig).toBeDefined();
    expect(appConfig.port).toBeDefined();
  });

  it('should get database config', () => {
    const dbConfig = service.getDatabase();
    expect(dbConfig).toBeDefined();
    expect(dbConfig.url).toBeDefined();
  });

  it('should check environment', () => {
    expect(service.isDev()).toBe(false); // NODE_ENV is set to 'test'
  });

  it('should check if isProd returns false in test environment', () => {
    expect(service.isProd()).toBe(false);
  });

  it('should check if isTest returns true in test environment', () => {
    expect(service.isTest()).toBe(true);
  });

  it('should get JWT config', () => {
    const jwtConfig = service.getJwt();
    expect(jwtConfig).toBeDefined();
    expect(jwtConfig.secret).toBeDefined();
    expect(jwtConfig.expiresIn).toBeDefined();
  });

  it('should get Redis config', () => {
    const redisConfig = service.getRedis();
    expect(redisConfig).toBeDefined();
    expect(redisConfig!.host).toBeDefined();
  });

  it('should get Throttle config', () => {
    const throttleConfig = service.getThrottle();
    expect(throttleConfig).toBeDefined();
    expect(throttleConfig.ttl).toBeDefined();
    expect(throttleConfig.limit).toBeDefined();
  });

  it('should get Swagger config', () => {
    const swaggerConfig = service.getSwagger();
    expect(swaggerConfig).toBeDefined();
    expect(swaggerConfig.enabled).toBeDefined();
    expect(swaggerConfig.title).toBeDefined();
  });

  it('should get environment value', () => {
    const env = service.getEnv();
    expect(env).toBe('test');
  });

  describe('get (type-safe config getter)', () => {
    it('should throw error for invalid config key format', () => {
      expect(() => {
        service.get('invalid' as any);
      }).toThrow('Invalid configuration key');
    });

    it('should throw error for key without property', () => {
      expect(() => {
        service.get('app' as any);
      }).toThrow('Invalid configuration key');
    });
  });
});
