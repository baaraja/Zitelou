import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(username: string, pin: string, avatar?: string) {
    return this.prisma.user.create({
      data: { username, pin, avatar },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { devices: true },
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, username: user.username, avatar: user.avatar };
  }

  async updateProfile(id: string, username?: string, avatar?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const data: any = {};
    if (username && username !== user.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existing) throw new Error('Username already taken');
      data.username = username;
    }
    if (avatar !== undefined) data.avatar = avatar;
    if (Object.keys(data).length === 0) {
      return { id: user.id, username: user.username, avatar: user.avatar };
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, avatar: true },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
