import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, conversationId: string, encryptedContent: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const contactExists = await this.prisma.contact.findFirst({
      where: { userId: conversation.contactId, contactId: senderId },
    });
    if (!contactExists) {
      await this.prisma.contact.create({
        data: { userId: conversation.contactId, contactId: senderId },
      });
    }
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        encryptedContent,
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    const partnerConversation = await this.prisma.conversation.findFirst({
      where: {
        userId: conversation.contactId,
        contactId: conversation.userId,
      },
    });
    if (partnerConversation) {
      await this.prisma.message.create({
        data: {
          conversationId: partnerConversation.id,
          senderId,
          encryptedContent,
          isDelivered: true,
          deliveredAt: new Date(),
        },
      });
    }
    await this.prisma.conversation.updateMany({
      where: {
        OR: [
          { id: conversationId },
          {
            userId: conversation.contactId,
            contactId: conversation.userId,
          },
        ],
      },
      data: { lastMessageAt: new Date() },
    });
    return message;
  }

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
