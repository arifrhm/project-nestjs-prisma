import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from './rbac.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RbacService', () => {
  let service: RbacService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    roleId: 1,
    role: {
      id: 1,
      name: 'Admin',
      permissions: [
        {
          id: 1,
          roleId: 1,
          permissionId: 1,
          permission: {
            id: 1,
            name: 'post:create',
            resource: 'post',
            action: 'create',
          },
        },
        {
          id: 2,
          roleId: 1,
          permissionId: 3,
          permission: {
            id: 3,
            name: 'post:update_any',
            resource: 'post',
            action: 'update_any',
          },
        },
        {
          id: 3,
          roleId: 1,
          permissionId: 5,
          permission: {
            id: 5,
            name: 'post:delete_any',
            resource: 'post',
            action: 'delete_any',
          },
        },
      ],
    },
  };

  const mockPost = {
    id: 1,
    authorId: 2,
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      findUnique: jest.fn(),
    },
    rolePermission: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RbacService>(RbacService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasPermission', () => {
    it('should return true if user has permission', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.hasPermission(1, 'post', 'create');

      expect(result).toBe(true);
    });

    it('should return false if user does not have permission', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.hasPermission(1, 'post', 'delete_own');

      expect(result).toBe(false);
    });

    it('should return false if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.hasPermission(999, 'post', 'create');

      expect(result).toBe(false);
    });

    it('should return false if user has no role', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ ...mockUser, role: null });

      const result = await service.hasPermission(1, 'post', 'create');

      expect(result).toBe(false);
    });
  });

  describe('canUpdatePost', () => {
    it('should return true if user has update_any permission', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.canUpdatePost(1, 1);

      expect(result).toBe(true);
    });

    it('should return true if user is owner with update_own permission', async () => {
      const ownerPost = { id: 1, authorId: 1 };
      const ownerUser = {
        ...mockUser,
        role: {
          ...mockUser.role,
          permissions: [
            {
              id: 1,
              roleId: 1,
              permissionId: 2,
              permission: {
                id: 2,
                name: 'post:update_own',
                resource: 'post',
                action: 'update_own',
              },
            },
          ],
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(ownerPost);
      mockPrismaService.user.findUnique.mockResolvedValue(ownerUser);

      const result = await service.canUpdatePost(1, 1);

      expect(result).toBe(true);
    });

    it('should return false if user is not owner and no update_any permission', async () => {
      const userWithoutPerm = {
        ...mockUser,
        role: {
          ...mockUser.role,
          permissions: [],
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.user.findUnique.mockResolvedValue(userWithoutPerm);

      const result = await service.canUpdatePost(1, 1);

      expect(result).toBe(false);
    });

    it('should return false if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.canUpdatePost(1, 999);

      expect(result).toBe(false);
    });
  });

  describe('canDeletePost', () => {
    it('should return true if user has delete_any permission', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.canDeletePost(1, 1);

      expect(result).toBe(true);
    });

    it('should return true if user is owner with delete_own permission', async () => {
      const ownerPost = { id: 1, authorId: 1 };
      const ownerUser = {
        ...mockUser,
        role: {
          ...mockUser.role,
          permissions: [
            {
              id: 1,
              roleId: 1,
              permissionId: 4,
              permission: {
                id: 4,
                name: 'post:delete_own',
                resource: 'post',
                action: 'delete_own',
              },
            },
          ],
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(ownerPost);
      mockPrismaService.user.findUnique.mockResolvedValue(ownerUser);

      const result = await service.canDeletePost(1, 1);

      expect(result).toBe(true);
    });

    it('should return false if user is not owner and no delete_any permission', async () => {
      const userWithoutPerm = {
        ...mockUser,
        role: {
          ...mockUser.role,
          permissions: [],
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.user.findUnique.mockResolvedValue(userWithoutPerm);

      const result = await service.canDeletePost(1, 1);

      expect(result).toBe(false);
    });

    it('should return false if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.canDeletePost(1, 999);

      expect(result).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return role permissions', async () => {
      mockPrismaService.rolePermission.findMany.mockResolvedValue(
        mockUser.role.permissions,
      );

      const result = await service.getRolePermissions(1);

      expect(result).toEqual(mockUser.role.permissions);
      expect(prismaService.rolePermission.findMany).toHaveBeenCalledWith({
        where: { roleId: 1 },
        include: { permission: true },
      });
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign permission to role', async () => {
      mockPrismaService.rolePermission.upsert.mockResolvedValue({});

      await service.assignPermissionToRole(1, 1);

      expect(prismaService.rolePermission.upsert).toHaveBeenCalledWith({
        where: {
          roleId_permissionId: {
            roleId: 1,
            permissionId: 1,
          },
        },
        update: {},
        create: {
          roleId: 1,
          permissionId: 1,
        },
      });
    });
  });

  describe('revokePermissionFromRole', () => {
    it('should revoke permission from role', async () => {
      mockPrismaService.rolePermission.delete.mockResolvedValue({});

      await service.revokePermissionFromRole(1, 1);

      expect(prismaService.rolePermission.delete).toHaveBeenCalledWith({
        where: {
          roleId_permissionId: {
            roleId: 1,
            permissionId: 1,
          },
        },
      });
    });
  });
});
