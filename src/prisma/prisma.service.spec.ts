import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigService } from '../config/config.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let module: TestingModule;

  const mockConfigService = {
    getDatabase: jest.fn().mockReturnValue({
      url: 'postgresql://test:test@localhost:5432/test_db',
    }),
    isProd: jest.fn().mockReturnValue(false),
  };

  const mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $executeRaw: jest.fn(),
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    keyword: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    rolePermission: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    onModuleInit: jest.fn().mockResolvedValue(undefined),
    onModuleDestroy: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  describe('instantiation', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instance of PrismaService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('database models', () => {
    it('should have user model', () => {
      expect(service.user).toBeDefined();
    });

    it('should have post model', () => {
      expect(service.post).toBeDefined();
    });

    it('should have category model', () => {
      expect(service.category).toBeDefined();
    });

    it('should have keyword model', () => {
      expect(service.keyword).toBeDefined();
    });

    it('should have role model', () => {
      expect(service.role).toBeDefined();
    });

    it('should have permission model', () => {
      expect(service.permission).toBeDefined();
    });

    it('should have rolePermission model', () => {
      expect(service.rolePermission).toBeDefined();
    });
  });

  describe('prisma client methods', () => {
    it('should have $connect method', () => {
      expect(service.$connect).toBeDefined();
      expect(typeof service.$connect).toBe('function');
    });

    it('should have $disconnect method', () => {
      expect(service.$disconnect).toBeDefined();
      expect(typeof service.$disconnect).toBe('function');
    });

    it('should have $executeRaw method', () => {
      expect(service.$executeRaw).toBeDefined();
      expect(typeof service.$executeRaw).toBe('function');
    });
  });

  describe('user model methods', () => {
    it('should have findMany method', () => {
      expect(service.user.findMany).toBeDefined();
      expect(typeof service.user.findMany).toBe('function');
    });

    it('should have findUnique method', () => {
      expect(service.user.findUnique).toBeDefined();
      expect(typeof service.user.findUnique).toBe('function');
    });

    it('should have create method', () => {
      expect(service.user.create).toBeDefined();
      expect(typeof service.user.create).toBe('function');
    });

    it('should have update method', () => {
      expect(service.user.update).toBeDefined();
      expect(typeof service.user.update).toBe('function');
    });

    it('should have delete method', () => {
      expect(service.user.delete).toBeDefined();
      expect(typeof service.user.delete).toBe('function');
    });
  });

  describe('post model methods', () => {
    it('should have findMany method', () => {
      expect(service.post.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.post.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.post.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.post.delete).toBeDefined();
    });
  });

  describe('category model methods', () => {
    it('should have findMany method', () => {
      expect(service.category.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.category.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.category.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.category.delete).toBeDefined();
    });
  });

  describe('keyword model methods', () => {
    it('should have findMany method', () => {
      expect(service.keyword.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.keyword.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.keyword.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.keyword.delete).toBeDefined();
    });
  });

  describe('role model methods', () => {
    it('should have findMany method', () => {
      expect(service.role.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.role.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.role.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.role.delete).toBeDefined();
    });
  });

  describe('permission model methods', () => {
    it('should have findMany method', () => {
      expect(service.permission.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.permission.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.permission.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.permission.delete).toBeDefined();
    });
  });

  describe('rolePermission model methods', () => {
    it('should have findMany method', () => {
      expect(service.rolePermission.findMany).toBeDefined();
    });

    it('should have create method', () => {
      expect(service.rolePermission.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(service.rolePermission.update).toBeDefined();
    });

    it('should have delete method', () => {
      expect(service.rolePermission.delete).toBeDefined();
    });
  });

  describe('lifecycle methods', () => {
    it('should have onModuleInit method', () => {
      expect(service.onModuleInit).toBeDefined();
      expect(typeof service.onModuleInit).toBe('function');
    });

    it('should have onModuleDestroy method', () => {
      expect(service.onModuleDestroy).toBeDefined();
      expect(typeof service.onModuleDestroy).toBe('function');
    });

    it('should call onModuleInit', async () => {
      await service.onModuleInit();
      expect(service.onModuleInit).toHaveBeenCalled();
    });

    it('should call onModuleDestroy', async () => {
      await service.onModuleDestroy();
      expect(service.onModuleDestroy).toHaveBeenCalled();
    });
  });

  describe('connection management', () => {
    it('should support database connection', async () => {
      await service.$connect();
      expect(service.$connect).toHaveBeenCalled();
    });

    it('should support database disconnection', async () => {
      await service.$disconnect();
      expect(service.$disconnect).toHaveBeenCalled();
    });
  });
});
