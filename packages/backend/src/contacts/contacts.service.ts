import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async addContact(userId: string, contactId: string) {
    return this.prisma.contact.create({
      data: {
        userId,
        contactId,
      },
    });
  }

  async getUserContacts(userId: string) {
    return this.prisma.contact.findMany({
      where: { userId },
      include: { contact: true },
    });
  }

  async verifyContact(userId: string, contactId: string) {
    return this.prisma.contact.update({
      where: {
        userId_contactId: {
          userId,
          contactId,
        },
      },
      data: { verified: true },
    });
  }
}
