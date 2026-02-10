import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  async getContacts(@Request() req: any) {
    return this.contactsService.getUserContacts(req.user.id);
  }

  @Post()
  async addContact(@Request() req: any, @Body() dto: { contactId: string }) {
    return this.contactsService.addContact(req.user.id, dto.contactId);
  }

  @Delete(':contactId')
  async removeContact(@Request() req: any, @Param('contactId') contactId: string) {
    return this.contactsService.removeContact(req.user.id, contactId);
  }

  @Post(':contactId/block')
  async blockContact(
    @Request() req: any,
    @Param('contactId') contactId: string,
    @Body() dto: { reason?: string },
  ) {
    return this.contactsService.blockContact(req.user.id, contactId, dto.reason);
  }

  @Delete(':contactId/block')
  async unblockContact(@Request() req: any, @Param('contactId') contactId: string) {
    return this.contactsService.unblockContact(req.user.id, contactId);
  }

  @Get('blocked')
  async getBlocked(@Request() req: any) {
    return this.contactsService.getBlockedContacts(req.user.id);
  }

  @Post(':approvedId/whitelist')
  async whitelistContact(@Request() req: any, @Param('approvedId') approvedId: string) {
    return this.contactsService.whitelistContact(req.user.id, approvedId);
  }

  @Delete(':approvedId/whitelist')
  async removeFromWhitelist(@Request() req: any, @Param('approvedId') approvedId: string) {
    return this.contactsService.removeFromWhitelist(req.user.id, approvedId);
  }

  @Get('whitelist')
  async getWhitelisted(@Request() req: any) {
    return this.contactsService.getWhitelistedContacts(req.user.id);
  }
}
