import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: { username: string; pin: string; avatar?: string }) {
    return this.usersService.create(
      createUserDto.username,
      createUserDto.pin,
      createUserDto.avatar,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateDto: { username?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(
      req.user.id,
      updateDto.username,
      updateDto.avatar,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Request() req: any) {
    await this.usersService.deleteUser(req.user.id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
