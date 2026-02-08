import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ContactsModule } from './contacts/contacts.module';
import { DevicesModule } from './devices/devices.module';
import { ConversationsModule } from './conversations/conversations.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CryptoModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    ContactsModule,
    ConversationsModule,
    MessagesModule,
  ],
})
export class AppModule {}
