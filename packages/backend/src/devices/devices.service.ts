import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, deviceName: string) {
    const publicKey = randomBytes(32).toString('hex');
    const privateKeyHash = randomBytes(32).toString('hex');
    return this.prisma.device.upsert({
      where: {
        userId_deviceName: {
          userId,
          deviceName,
        },
      },
      update: {
        publicKey,
        privateKeyHash,
      },
      create: {
        userId,
        deviceName,
        publicKey,
        privateKeyHash,
      },
    });
  }

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
