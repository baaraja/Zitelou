import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async registerDevice(
    userId: string,
    deviceName: string,
    publicKey: string,
    privateKeyHash: string,
  ) {
    return this.prisma.device.create({
      data: {
        userId,
        deviceName,
        publicKey,
        privateKeyHash,
      },
    });
  }

  async getUserDevices(userId: string) {
    return this.prisma.device.findMany({
      where: { userId },
    });
  }

  async updateLastSeen(deviceId: string) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: { lastSeen: new Date() },
    });
  }

  async deactivateDevice(deviceId: string) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: { isActive: false },
    });
  }
}
