export enum Resource {
  POST = 'post',
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface PermissionRule {
  resource: Resource | string;
  action: Action | string;
  condition?: (userId: number, resourceOwnerId?: number) => boolean;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roleId: number;
  };
}
