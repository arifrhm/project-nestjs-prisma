import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacGuard } from './rbac.guard';
import { RbacService } from '../rbac.service';
import { PERMISSION_KEY } from '../decorators';

describe('RbacGuard', () => {
  let guard: RbacGuard;
  let reflector: Reflector;
  let rbacService: RbacService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    roleId: 1,
  };

  const mockRbacService = {
    hasPermission: jest.fn().mockResolvedValue(true),
    canUpdatePost: jest.fn().mockResolvedValue(true),
    canDeletePost: jest.fn().mockResolvedValue(true),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacGuard,
        {
          provide: RbacService,
          useValue: mockRbacService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RbacGuard>(RbacGuard);
    reflector = module.get<Reflector>(Reflector);
    rbacService = module.get<RbacService>(RbacService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;

    beforeEach(() => {
      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: mockUser,
          }),
        }),
      } as any;
    });

    it('should allow access when no permissions required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(null);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when empty permissions required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has required permission', async () => {
      const permissions = [{ resource: 'post', action: 'create' }];
      mockReflector.getAllAndOverride.mockReturnValue(permissions);
      mockRbacService.hasPermission.mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(rbacService.hasPermission).toHaveBeenCalledWith(
        mockUser.id,
        'post',
        'create',
      );
    });

    it('should deny access when user does not have required permission', async () => {
      const permissions = [{ resource: 'post', action: 'create' }];
      mockReflector.getAllAndOverride.mockReturnValue(permissions);
      mockRbacService.hasPermission.mockResolvedValue(false);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow access if user has one of multiple permissions', async () => {
      const permissions = [
        { resource: 'post', action: 'create' },
        { resource: 'post', action: 'update' },
      ];
      mockReflector.getAllAndOverride.mockReturnValue(permissions);
      mockRbacService.hasPermission
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user not authenticated', async () => {
      const permissions = [{ resource: 'post', action: 'create' }];
      mockReflector.getAllAndOverride.mockReturnValue(permissions);

      const contextNoUser = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: null,
          }),
        }),
      } as any;

      await expect(guard.canActivate(contextNoUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when all permissions denied', async () => {
      const permissions = [
        { resource: 'post', action: 'create' },
        { resource: 'post', action: 'delete' },
      ];
      mockReflector.getAllAndOverride.mockReturnValue(permissions);
      mockRbacService.hasPermission.mockResolvedValue(false);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should call reflector with correct parameters', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);
      const handler = jest.fn();
      const classRef = jest.fn();

      mockContext.getHandler.mockReturnValue(handler);
      mockContext.getClass.mockReturnValue(classRef);

      await guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        PERMISSION_KEY,
        [handler, classRef],
      );
    });
  });
});
