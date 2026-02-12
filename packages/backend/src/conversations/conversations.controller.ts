import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get()
  async getConversations(@Request() req: any) {
    return this.conversationsService.getUserConversations(req.user.id);
  }

  @Post('create')
  async createConversation(
    @Request() req: any,
    @Body() dto: { contactId: string },
  ) {
    return this.conversationsService.createOrGetConversation(req.user.id, dto.contactId);
  }

  @Get(':id')
  async getConversation(@Param('id') id: string) {
    return this.conversationsService.getConversation(id);
  }

  @Delete(':id')
  async deleteConversation(@Param('id') id: string) {
    return this.conversationsService.deleteConversation(id);
  }
}
