import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../contants/api';

class SocketClient {
  private socket: Socket | null = null;

  private getSocketBaseUrl() {
    return BASE_URL.replace(/\/api\/v1\/?$/, '');
  }

  async connect(userId: number | string, token: string): Promise<Socket> {
    if (this.socket?.connected) return this.socket;
    if (this.socket && !this.socket.connected) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(this.getSocketBaseUrl(), {
      transports: ['polling', 'websocket'],
      auth: { token },
      query: { userId: String(userId) },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    return new Promise<Socket>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.socket?.connected) resolve(this.socket);
        else reject(new Error('Socket connection timeout'));
      }, 12000);

      this.socket!.once('connect', () => {
        clearTimeout(timeout);
        this.socket?.emit('user-online', Number(userId));
        resolve(this.socket!);
      });

      this.socket!.once('connect_error', (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  joinChat(chatId: number) {
    this.socket?.emit('join-chat', chatId);
  }

  leaveChat(chatId: number) {
    this.socket?.emit('leave-chat', chatId);
  }

  sendMessage(data: { chatId: number; content: string; messageType?: string; senderId?: number }) {
    this.socket?.emit('send-message', data);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new-message', callback);
  }

  offNewMessage(callback?: (message: any) => void) {
    this.socket?.off('new-message', callback);
  }

  onChatUpdated(callback: (chat: any) => void) {
    this.socket?.on('chat-updated', callback);
  }

  offChatUpdated(callback?: (chat: any) => void) {
    this.socket?.off('chat-updated', callback);
  }

  onMessageError(callback: (error: any) => void) {
    this.socket?.on('message-error', callback);
  }

  offMessageError(callback?: (error: any) => void) {
    this.socket?.off('message-error', callback);
  }

  isConnected() {
    return !!this.socket?.connected;
  }
}

export const socketClient = new SocketClient();
