import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { PowerModule } from 'src/power/power.module';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiskModule } from 'src/disk/disk.module';

@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiskModule],
})
export class ComputerModule {}
