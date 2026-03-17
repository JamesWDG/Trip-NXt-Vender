import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { BASE_URL } from '../contants/api';

export function useChatSocket(onEventHandlers: {
  onMessage?: (msg: any) => void;
  onChatUpdated?: (chats: any[]) => void;
  onReadUpdate?: (payload: any) => void;
}) {
  const token = useSelector((s: RootState) => s.auth?.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(BASE_URL.replace(/\/api\/v1$/, ''), {
      transports: ['websocket'],
      auth: { token },
    });
    socketRef.current = socket;

    if (onEventHandlers.onMessage) {
      socket.on('chat:message', onEventHandlers.onMessage);
    }
    if (onEventHandlers.onChatUpdated) {
      socket.on('chat:chat_updated', onEventHandlers.onChatUpdated);
    }
    if (onEventHandlers.onReadUpdate) {
      socket.on('chat:read_update', onEventHandlers.onReadUpdate);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return socketRef;
}

