import { Module } from '@nestjs/common';
import { ServicesController } from './infrastructure/services.controller';
import { ServicesService } from './applications/services.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
