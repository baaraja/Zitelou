import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private devicesService: DevicesService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, pin: string, deviceName: string) {
    const user = await this.usersService.create(username, pin);
    const device = await this.devicesService.create(user.id, deviceName);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, avatar: user.avatar },
      deviceId: device.id,
    };
  }

  async validateUser(username: string, pin: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && user.pin === pin) {
      return user;
    }
    return null;
  }

  async login(user: any, deviceName: string) {
    const device = await this.devicesService.create(user.id, deviceName);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, avatar: user.avatar },
      deviceId: device.id,
    };
  }
}
