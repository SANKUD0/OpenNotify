import { Module } from '@nestjs/common';
import { PrismaService } from './shared/database/prisma.service';
import { PrismaModule } from './shared/database/prisma.module';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [PrismaModule, ServicesModule],
})
export class AppModule {}
