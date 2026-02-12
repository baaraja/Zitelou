import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async createOrGetConversation(userId: string, contactId: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: { userId, contactId },
    });
    
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { userId, contactId },
      });
      
      await this.prisma.conversation.create({
        data: { userId: contactId, contactId: userId },
      });
    }
    
    return conversation;
  }

  async createConversation(userId: string, contactId: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: { userId, contactId },
    });
    
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { userId, contactId },
      });
      
      await this.prisma.conversation.create({
        data: { userId: contactId, contactId: userId },
      });
    }
    
    return conversation;
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
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    
    if (conversation) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });
      
      await this.prisma.conversation.updateMany({
        where: { 
          userId: conversation.contactId,
          contactId: conversation.userId,
        },
        data: { lastMessageAt: new Date() },
      });
    }
  }

  async deleteConversation(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    
    if (conversation) {
      await this.prisma.conversation.deleteMany({
        where: {
          OR: [
            { id: conversationId },
            {
              userId: conversation.contactId,
              contactId: conversation.userId,
            },
          ],
        },
      });
    }
    
    return conversation;
  }
}
