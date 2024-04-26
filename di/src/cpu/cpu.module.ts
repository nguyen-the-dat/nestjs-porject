import { Module } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerModule } from 'src/power/power.module';
@Module({
  imports: [PowerModule],
  providers: [CpuService],
  exports: [CpuService],
  // provider : things that can be used as dependencies for other classes
})
export class CpuModule {}
