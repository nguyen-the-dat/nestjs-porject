import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { PowerModule } from 'src/power/power.module';
import { PowerService } from 'src/power/power.service';

@Module({
  providers: [DiskService],
  imports: [PowerModule],
  exports: [DiskService],
})
export class DiskModule {}
