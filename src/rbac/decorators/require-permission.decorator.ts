import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';

export interface RequiredPermission {
  resource: string;
  action: string;
}

export const RequirePermission = (
  ...permissions: RequiredPermission[]
) => SetMetadata(PERMISSION_KEY, permissions);
