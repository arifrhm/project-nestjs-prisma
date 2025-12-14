import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private prismaClient: PrismaClient;

  constructor(configService: ConfigService) {
    const isProd = configService.isProd();
    const databaseUrl = configService.getDatabase().url;
    
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    
    this.prismaClient = new PrismaClient({
      adapter,
      log: isProd 
        ? ['error', 'warn']
        : ['query', 'info', 'warn', 'error'],
      errorFormat: isProd ? 'minimal' : 'pretty',
    });
  }

  // Expose PrismaClient methods
  get user() {
    return this.prismaClient.user;
  }

  get post() {
    return this.prismaClient.post;
  }

  get category() {
    return this.prismaClient.category;
  }

  get keyword() {
    return this.prismaClient.keyword;
  }

  get role() {
    return this.prismaClient.role;
  }

  get permission() {
    return this.prismaClient.permission;
  }

  get rolePermission() {
    return this.prismaClient.rolePermission;
  }

  async onModuleInit() {
    try {
      await this.prismaClient.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
    this.logger.log('Database disconnected');
  }
}
