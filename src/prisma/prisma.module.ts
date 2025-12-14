import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat PrismaService tersedia di seluruh aplikasi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
