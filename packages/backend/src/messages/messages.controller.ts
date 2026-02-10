import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversation/:conversationId')
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Body() dto: { limit?: number; offset?: number },
  ) {
    return this.messagesService.getConversationMessages(
      conversationId,
      dto.limit || 50,
      dto.offset || 0,
    );
  }

  @Get(':id')
  async getMessage(@Param('id') id: string) {
    return this.messagesService.getMessage(id);
  }

  @Post(':id/delivered')
  async markAsDelivered(@Param('id') id: string) {
    return this.messagesService.markAsDelivered(id);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }

  @Post('conversation/:conversationId/read')
  async markConversationAsRead(@Param('conversationId') conversationId: string, @Request() req: any) {
    return this.messagesService.markConversationAsRead(conversationId, req.user.id);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messagesService.deleteMessage(id);
  }
}
