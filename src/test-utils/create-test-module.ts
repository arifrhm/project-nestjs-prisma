import { TestingModuleBuilder } from '@nestjs/testing';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RbacService } from '../rbac/rbac.service';

export function mockRbacGuardAndService(builder: TestingModuleBuilder) {
  const mockRbacService = {
    hasPermission: jest.fn().mockResolvedValue(true),
    canUpdatePost: jest.fn().mockResolvedValue(true),
    canDeletePost: jest.fn().mockResolvedValue(true),
    getRolePermissions: jest.fn(),
    assignPermissionToRole: jest.fn(),
    revokePermissionFromRole: jest.fn(),
  };

  return builder
    .overrideGuard(RbacGuard)
    .useValue({
      canActivate: jest.fn().mockReturnValue(true),
    })
    .overrideProvider(RbacService)
    .useValue(mockRbacService);
}
