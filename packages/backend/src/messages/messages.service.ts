import { Injectable, NotFoundException } from '@nestjs/common';
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
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async getMessage(messageId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Message not found');
    return message;
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

  async markConversationAsRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId } },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
