import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';
import { PERMISSION_KEY, RequiredPermission } from '../decorators';
import { AuthRequest } from '../types';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has at least one of the required permissions
    for (const permission of requiredPermissions) {
      const hasPermission = await this.rbacService.hasPermission(
        user.id,
        permission.resource,
        permission.action,
      );

      if (hasPermission) {
        return true;
      }
    }

    throw new ForbiddenException(
      'User does not have required permissions',
    );
  }
}
