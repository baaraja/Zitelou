import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CryptoService } from '../crypto/crypto.service';
import { ConversationsService } from '../conversations/conversations.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/messages',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private userSockets = new Map<string, string>();

  constructor(
    private messagesService: MessagesService,
    private cryptoService: CryptoService,
    private conversationsService: ConversationsService,
  ) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;
    const deviceId = socket.handshake.auth.deviceId;
    if (userId && deviceId) {
      this.userSockets.set(userId, socket.id);
      socket.join(`user:${userId}`);
      socket.emit('connected', { message: 'Connected to message gateway' });
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      this.userSockets.delete(userId);
      socket.leave(`user:${userId}`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: {
      conversationId: string;
      content: string;
      sharedSecret: string;
    },
  ) {
    const senderId = socket.handshake.auth.userId;
    if (!senderId) return;

    const encryptedContent = this.cryptoService.encryptMessage(
      payload.content,
      payload.sharedSecret,
    );

    const message = await this.messagesService.create(
      payload.conversationId,
      senderId,
      encryptedContent,
    );

    await this.conversationsService.updateLastMessage(payload.conversationId);
    this.server
      .to(`conversation:${payload.conversationId}`)
      .emit('message_received', message);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    socket.join(`conversation:${payload.conversationId}`);
  }

  @SubscribeMessage('mark_delivered')
  async handleMarkDelivered(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { messageId: string },
  ) {
    const message = await this.messagesService.markAsDelivered(payload.messageId);
    this.server.emit('message_delivered', message);
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { messageId: string },
  ) {
    const message = await this.messagesService.markAsRead(payload.messageId);
    this.server.emit('message_read', message);
  }
}
