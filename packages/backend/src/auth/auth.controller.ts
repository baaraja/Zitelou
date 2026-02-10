import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: { username: string; pin: string; deviceName: string },
  ) {
    try {
      return await this.authService.register(
        registerDto.username,
        registerDto.pin,
        registerDto.deviceName,
      );
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: { username: string; pin: string; deviceName: string },
  ) {
    try {
      const user = await this.authService.validateUser(loginDto.username, loginDto.pin);
      if (!user) {
        throw new HttpException(
          'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.authService.login(user, loginDto.deviceName);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
