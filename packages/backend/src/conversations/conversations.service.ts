import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, contactId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { userId, contactId },
    });
    if (existing) return existing;
    return this.prisma.conversation.create({
      data: { userId, contactId },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversation(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async updateLastMessage(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });
  }

  async deleteConversation(conversationId: string) {
    return this.prisma.conversation.delete({ where: { id: conversationId } });
  }
}
