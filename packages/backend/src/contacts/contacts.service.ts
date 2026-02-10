import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async addContact(userId: string, contactId: string) {
    if (userId === contactId) throw new BadRequestException('Cannot add yourself');
    const existing = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (existing) throw new BadRequestException('Contact already added');
    return this.prisma.contact.create({
      data: { userId, contactId },
      include: { contact: true },
    });
  }

  async getUserContacts(userId: string) {
    return this.prisma.contact.findMany({
      where: { userId },
      include: { contact: { select: { id: true, username: true, avatar: true } } },
    });
  }

  async removeContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.delete({
      where: { userId_contactId: { userId, contactId } },
    });
  }

  async verifyContact(userId: string, contactId: string) {
    return this.prisma.contact.update({
      where: { userId_contactId: { userId, contactId } },
      data: { verified: true },
    });
  }

  async blockContact(userId: string, blockedId: string, reason?: string) {
    const existing = await this.prisma.blockList.findUnique({
      where: { userId_blockedId: { userId, blockedId } },
    });
    if (existing) throw new BadRequestException('Already blocked');
    return this.prisma.blockList.create({
      data: { userId, blockedId, reason },
    });
  }

  async unblockContact(userId: string, blockedId: string) {
    return this.prisma.blockList.delete({
      where: { userId_blockedId: { userId, blockedId } },
    });
  }

  async getBlockedContacts(userId: string) {
    return this.prisma.blockList.findMany({ where: { userId } });
  }

  async whitelistContact(userId: string, approvedId: string) {
    const existing = await this.prisma.whiteList.findUnique({
      where: { userId_approvedId: { userId, approvedId } },
    });
    if (existing) throw new BadRequestException('Already whitelisted');
    return this.prisma.whiteList.create({
      data: { userId, approvedId },
    });
  }

  async removeFromWhitelist(userId: string, approvedId: string) {
    return this.prisma.whiteList.delete({
      where: { userId_approvedId: { userId, approvedId } },
    });
  }

  async getWhitelistedContacts(userId: string) {
    return this.prisma.whiteList.findMany({ where: { userId } });
  }

  async isBlocked(userId: string, contactId: string): Promise<boolean> {
    const blocked = await this.prisma.blockList.findUnique({
      where: { userId_blockedId: { userId, blockedId: contactId } },
    });
    return !!blocked;
  }
}
