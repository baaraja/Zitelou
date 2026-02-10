import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get()
  async getUserDevices(@Request() req: any) {
    return this.devicesService.getUserDevices(req.user.id);
  }

  @Delete(':deviceId')
  async deactivateDevice(@Param('deviceId') deviceId: string) {
    return this.devicesService.deactivateDevice(deviceId);
  }
}
