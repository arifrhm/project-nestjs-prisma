import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resource, Action } from './types';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if user has permission
   */
  async hasPermission(
    userId: number,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) {
      return false;
    }

    return user.role.permissions.some(
      (rp) =>
        rp.permission.resource === resource && rp.permission.action === action,
    );
  }

  /**
   * Check if user can update post
   * - Admin: can update any post (update_any permission)
   * - Owner: can update own post (update_own permission)
   */
  async canUpdatePost(userId: number, postId: number): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return false;
    }

    // Check if user has admin permission to update any post
    const hasUpdateAnyPermission = await this.hasPermission(
      userId,
      Resource.POST,
      'update_any',
    );

    if (hasUpdateAnyPermission) {
      return true;
    }

    // Check if user is owner and has permission to update own post
    if (post.authorId === userId) {
      const hasUpdateOwnPermission = await this.hasPermission(
        userId,
        Resource.POST,
        'update_own',
      );
      return hasUpdateOwnPermission;
    }

    return false;
  }

  /**
   * Check if user can delete post
   * - Admin: can delete any post (delete_any permission)
   * - Owner: can delete own post (delete_own permission)
   */
  async canDeletePost(userId: number, postId: number): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return false;
    }

    // Check if user has admin permission to delete any post
    const hasDeleteAnyPermission = await this.hasPermission(
      userId,
      Resource.POST,
      'delete_any',
    );

    if (hasDeleteAnyPermission) {
      return true;
    }

    // Check if user is owner and has permission to delete own post
    if (post.authorId === userId) {
      const hasDeleteOwnPermission = await this.hasPermission(
        userId,
        Resource.POST,
        'delete_own',
      );
      return hasDeleteOwnPermission;
    }

    return false;
  }

  /**
   * Get all permissions for a role
   */
  async getRolePermissions(roleId: number) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      update: {},
      create: {
        roleId,
        permissionId,
      },
    });
  }

  /**
   * Revoke permission from role
   */
  async revokePermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }
}
