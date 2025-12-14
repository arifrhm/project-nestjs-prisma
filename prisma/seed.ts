import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create permissions
  const permissions = await Promise.all([
    // Post permissions
    prisma.permission.upsert({
      where: { name: 'post:create' },
      update: {},
      create: {
        name: 'post:create',
        description: 'Create new post',
        resource: 'post',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'post:read' },
      update: {},
      create: {
        name: 'post:read',
        description: 'Read post',
        resource: 'post',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'post:update_own' },
      update: {},
      create: {
        name: 'post:update_own',
        description: 'Update own post',
        resource: 'post',
        action: 'update_own',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'post:update_any' },
      update: {},
      create: {
        name: 'post:update_any',
        description: 'Update any post',
        resource: 'post',
        action: 'update_any',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'post:delete_own' },
      update: {},
      create: {
        name: 'post:delete_own',
        description: 'Delete own post',
        resource: 'post',
        action: 'delete_own',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'post:delete_any' },
      update: {},
      create: {
        name: 'post:delete_any',
        description: 'Delete any post',
        resource: 'post',
        action: 'delete_any',
      },
    }),
    // Category permissions
    prisma.permission.upsert({
      where: { name: 'category:create' },
      update: {},
      create: {
        name: 'category:create',
        description: 'Create category',
        resource: 'category',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'category:read' },
      update: {},
      create: {
        name: 'category:read',
        description: 'Read category',
        resource: 'category',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'category:update' },
      update: {},
      create: {
        name: 'category:update',
        description: 'Update category',
        resource: 'category',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'category:delete' },
      update: {},
      create: {
        name: 'category:delete',
        description: 'Delete category',
        resource: 'category',
        action: 'delete',
      },
    }),
    // Keyword permissions
    prisma.permission.upsert({
      where: { name: 'keyword:create' },
      update: {},
      create: {
        name: 'keyword:create',
        description: 'Create keyword',
        resource: 'keyword',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'keyword:read' },
      update: {},
      create: {
        name: 'keyword:read',
        description: 'Read keyword',
        resource: 'keyword',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'keyword:update' },
      update: {},
      create: {
        name: 'keyword:update',
        description: 'Update keyword',
        resource: 'keyword',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'keyword:delete' },
      update: {},
      create: {
        name: 'keyword:delete',
        description: 'Delete keyword',
        resource: 'keyword',
        action: 'delete',
      },
    }),
    // User permissions
    prisma.permission.upsert({
      where: { name: 'user:read' },
      update: {},
      create: {
        name: 'user:read',
        description: 'Read user',
        resource: 'user',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'user:update' },
      update: {},
      create: {
        name: 'user:update',
        description: 'Update user',
        resource: 'user',
        action: 'update',
      },
    }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator with full access',
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: {
      name: 'Editor',
      description: 'Editor can create and manage own posts',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Regular user',
    },
  });

  console.log('✅ Created 3 roles');

  // Assign permissions to Admin role
  const adminPermissions = [
    'post:create',
    'post:read',
    'post:update_any',
    'post:delete_any',
    'category:create',
    'category:read',
    'category:update',
    'category:delete',
    'keyword:create',
    'keyword:read',
    'keyword:update',
    'keyword:delete',
    'user:read',
    'user:update',
  ];

  for (const permName of adminPermissions) {
    const perm = permissions.find((p) => p.name === permName);
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log('✅ Assigned permissions to Admin role');

  // Assign permissions to Editor role
  const editorPermissions = [
    'post:create',
    'post:read',
    'post:update_own',
    'post:delete_own',
    'category:read',
    'keyword:read',
    'keyword:create',
    'keyword:update',
    'keyword:delete',
    'user:read',
  ];

  for (const permName of editorPermissions) {
    const perm = permissions.find((p) => p.name === permName);
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log('✅ Assigned permissions to Editor role');

  // Assign permissions to User role
  const userPermissions = [
    'post:read',
    'category:read',
    'keyword:read',
    'user:read',
  ];

  for (const permName of userPermissions) {
    const perm = permissions.find((p) => p.name === permName);
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log('✅ Assigned permissions to User role');
  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
