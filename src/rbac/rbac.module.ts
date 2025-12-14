import { Module, Global } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacGuard } from './guards/rbac.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [RbacService, RbacGuard],
  exports: [RbacService, RbacGuard],
})
export class RbacModule {}
