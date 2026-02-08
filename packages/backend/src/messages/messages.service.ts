import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(conversationId: string, senderId: string, encryptedContent: string) {
    return this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        encryptedContent,
      },
    });
  }

  async getConversationMessages(conversationId: string, limit = 50, offset = 0) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markAsDelivered(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
  }

  async markAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
